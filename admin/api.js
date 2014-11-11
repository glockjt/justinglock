/*
 * Serve JSON to our AngularJS client
 */

var mm = require('marky-mark');
var yaml = require('yamljs');
var md = require('html-md');
var fs = require('fs');

var posts = null;
var publicPosts = [];
var hash = {};

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) {
    'use strict';

    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
    'use strict';

    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

// need to recode this page to be cleaner
function init() {
    'use strict';

    publicPosts = [];
    posts = mm.parseDirectorySync(__dirname + "/posts");

    posts.sort(date_sort_desc);

    posts.forEach(function(post) {
        post.slug = post.filename;
        // make the dates readable
        post.meta.date = moment(post.meta.date, "YYYY-MM-DD").format("MMMM D, YYYY");
        post.meta.modified = moment(post.meta.modified, "YYYY-MM-DD").format("MMMM D, YYYY");
        // hash it
        hash[post.filename] = post;

        if(post.meta.status === 'Publish' || post.meta.status === 'Feature') {
            publicPosts.pushIfNotExist(post, function(p){
              return p.meta.title === post.meta.title && p.meta.modified === post.meta.modified;
            });
        }
    });

    // get just the meta objects from public posts
    var meta = publicPosts.map(function(p) {
      return p.meta;
    });

    // get all the statuses
    // todo: get the indexOf draft to remove it when a post goes from publish to draft
    meta.map(function(m) {
      return m.status;
    });
}

// Now we will define our date comparison functions. These are callbacks
// that we will be providing to the array sort method below.
var date_sort_asc = function (date1, date2) {
    'use strict';
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

var date_sort_desc = function (date1, date2) {
  'use strict';
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1.meta.modified > date2.meta.modified) return -1;
  if (date1.meta.modified < date2.meta.modified) return 1;
  return 0;
};

// create file data for storing in post directory
function createFileData(post) {
  'use strict';
  var filename = "";
  var filenameExtension = ".md";
  var yamlStr = "";
  var markdownStr = "";
  var content = "";
  var meta = {};
  var formattedPost = {};

  filename = post.meta.title.replace(/\s+/g, '-').toLowerCase();
  // markdownStr = toMarkdown(post.content);
  markdownStr = md(post.content);
  content = post.content;
  meta = {
    title: post.meta.title,
    featureImage: post.meta.featureImage,
    date: moment().format("YYYY-MM-DD"),
    modified: moment().format("YYYY-MM-DD"),
    description: post.meta.description, // need to implement this
    status: 'Draft', // need to add a feature to switch this
    tags:[] // also need to implement this
  };
  yamlStr = '---\n' + yaml.stringify(meta) + '---\n\n';

  formattedPost = {
    filename: filename,
    filenameExtension: filenameExtension,
    yaml: yamlStr,
    markdown: markdownStr,
    content: content,
    meta: meta
  };
  // console.log('formatted: ', formattedPost);
  return formattedPost;
}

// GET

exports.posts = function (req, res) {
    'use strict';
    init();

    res.json({
        posts: posts
    });
};

exports.post = function (req, res) {
    'use strict';
    init();

    var slug = req.params.slug;
   
    if (hash[slug]) {
        res.json({
            post: hash[slug]
        });
    } else{
        res.json(false);
    }
};

// POST

exports.addPost = function (req, res) {
  'use strict';

  var formattedPost = createFileData(req.body);
  fs.writeFile(__dirname + '/posts/' + formattedPost.filename + formattedPost.filenameExtension, formattedPost.yaml + formattedPost.markdown, function(err) {
  // fs.writeFile(__dirname + '/posts/' + formattedPost.filename + formattedPost.filenameExtension, formattedPost.yaml + formattedPost.content, function(err) {
    if(err) {
      console.log(err);
      res.json(false);
    }
    formattedPost.id = posts.length;
    posts.push(formattedPost);
  });
  res.json(formattedPost);
};

// PUT

exports.editPost = function (req, res) {
  'use strict';

  req.body.markdown = md(req.body.content);
  req.body.meta.date = moment(req.body.meta.date, "MMMM D, YYYY").format("YYYY-MM-DD");
  req.body.meta.modified = moment().format("YYYY-MM-DD");
  req.body.yaml = yaml.stringify(req.body.meta);

  if (hash[req.body.filename]) {
    fs.writeFile(__dirname + '/posts/' + req.body.filename + req.body.filenameExtension, '---\n' + req.body.yaml + '---\n\n' + req.body.markdown, function(err) {
    // fs.writeFile(__dirname + '/posts/' + req.body.filename + req.body.filenameExtension, '---\n' + req.body.yaml + '---\n\n' + req.body.content, function(err) {
      if(err) {
        console.log(err);
        res.json(false);
      }
      res.json(true);
    });
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  'use strict';
  var slug = req.params.slug;

  if (hash[slug]) {
    console.log('hash: ', hash[slug]);
    fs.unlink(__dirname + '/posts/' + hash[slug].filename + hash[slug].filenameExtension, function(err){
      if(err) throw err;
      console.log('successfully deleted' + hash[slug].filename + hash[slug].filenameExtension);
      res.json(true);
    });
  }
};

// Public blog pages

exports.publicPosts = function (req, res) {
    'use strict';

    init();

    publicPosts.sort(date_sort_desc);

    res.render('public/posts', { posts: publicPosts });
};

exports.publicPost = function(req, res) {
    'use strict';

    init();
    var slug= req.params.slug;
    if(hash[slug]) {
        res.render('public/readPost', { post: hash[slug] });
    }
};

// Post to be displayed on main website

exports.featurePost = function (req, res) {
  'use strict';

    init();

  req.session = null;

  if(posts === null) {
      posts = mm.parseDirectorySync(__dirname + "/posts");
  }

  for (var i = 0; i < posts.length; i++) {
    if(posts[i].meta.status === 'Feature') {
      res.json({
        post: posts[i]
      });
    }
  }
};