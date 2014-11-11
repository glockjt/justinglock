/*
 * Serve JSON to our AngularJS client
 */

var moment = require('moment');
var RSS = require('rss');
var config = require('../config');
var Post = require('./model/post');

var parseTags = function(postTags) {
  var tags = [];
  var parsedTags = (postTags || '').split(',');

  for (var i=0; i<parsedTags.length; i++) {
    tags.push(parsedTags[i]);
  }

  return tags;
}

var postFormat = function(dbFormat) {

  var oldFormat = {
    meta: {
      title: dbFormat.title,
      featureImage: dbFormat.featureImage,
      featureImageCredit: dbFormat.featureImageCredit,
      tags: dbFormat.tags,
      description: dbFormat.description,
      date: moment(dbFormat.date).format('MMMM D, YYYY'),
      modified: dbFormat.modified,
      status: dbFormat.status
    },
    slug: dbFormat.slug,
    filename: dbFormat.slug,
    content: dbFormat.content
  };

  return oldFormat;
}

var dbFormat = function(postFormat) {

  var newFormat = {
    title: postFormat.meta.title,
    featureImage: postFormat.meta.featureImage,
    featureImageCredit: postFormat.meta.featureImageCredit,
    tags: parseTags(postFormat.meta.tags),
    description: postFormat.meta.description,
    status: postFormat.meta.status,
    slug: postFormat.filename,
    content: postFormat.content
  };

  return newFormat;
}

// get all post for index
exports.posts = function (req, res) {
  'use strict';
  var limit = 5;
  var formattedPosts = [];

  Post
    .$where('this.status === "Draft" || "Feature" || "Publish"')
    .sort({ date: 'desc'})
    .exec(function(err, posts) {
      if(err) {
        res.statusCode(500);
        res.end();
      }
      console.log('posts: ', posts);

      posts.forEach(function(post) {
        var oldFormat = postFormat(post);
        formattedPosts.push(oldFormat);
      });
      res.json({
        posts: formattedPosts
      });
    });
};

// view post for edit
exports.post = function (req, res, next) {
  'use strict';

  Post
    .where('slug', req.params.slug)
    .findOne(function(err, post) {
      if(err || !post) {
        return next();
      }
      var oldFormat = postFormat(post);
      res.json({
        post: oldFormat
      });
    });
};

// add new post
exports.addPost = function (req, res) {
  'use strict';

  var newFormat = dbFormat(req.body);

  new Post(newFormat)
    .setSlugType('title')
    .save(function(err, data) {
      if(err) {
        res.statusCode = 400;
        res.json(err);
      } else {
        res.json(data);
      }
    });
};

// PUT

exports.editPost = function (req, res) {
  'use strict';

  Post
    .where('slug', req.params.slug)
    .findOne(function(err, post) {
      if(err || !post) {
        res.statusCode = 404;
        res.end();
        return;
      }

      post.title = req.body.meta.title;
      post.featureImage = req.body.meta.featureImage;
      post.featureImageCredit = req.body.meta.featureImageCredit;
      post.tags = parseTags(req.body.meta.tags);
      post.description = req.body.meta.description;
      // post.date = req.body.meta.date;
      post.modified = moment();
      post.status = req.body.meta.status;
      post.slug = req.body.filename;
      post.filename = req.body.slug;
      post.content = req.body.content;

      post.save(function(err, newPost) {
        if(err) {
          res.statusCode = 500;
          res.end();
          return console.log(err);
        }
        res.json(true);
      });

    });
};

// DELETE

exports.deletePost = function (req, res) {
  'use strict';

  Post
    .where('slug', req.params.slug)
    .findOne(function(err, post) {
      if(err || !post) {
        res.statusCode = 404;
        res.end();
        return;
      }

      post.remove(function(err) {
        if(err) {
          res.statusCode = 500;
          res.end();
          return console.log(err);
        }
        res.json(true);
      });
    });
};

// Public blog pages

exports.publicPosts = function (req, res) {
  'use strict';

  var formattedPosts = [];

  Post
    .$where('this.status !== "Draft"')
    .sort({ date: 'desc' })
    .exec(function(err, posts) {
      if(err) {
        res.statusCode(500);
        res.end();
      }

      posts.forEach(function(post) {
        var oldFormat = postFormat(post);
        formattedPosts.push(oldFormat);
      });
      res.render('public/posts', { posts: formattedPosts });
    });
};

exports.publicPost = function(req, res, next) {
  'use strict';

  Post
    .where('slug', req.params.slug)
    .findOne(function(err, post) {
      if(err || !post) {
        return next();
      }
      var oldFormat = postFormat(post);
      res.render('public/readPost', { post: oldFormat });
    });
};

// Post to be displayed on main website

exports.featurePost = function (req, res, next) {
  'use strict';

  Post
    .where('status', 'Feature')
    .findOne(function(err, post) {
      if(err || !post) {
        return next();
      }
      var oldFormat = postFormat(post);
      res.json({
        post: oldFormat
      });
    });
};

// RSS feed
exports.rssFeed = function(req, res) {
  'use strict';

  Post
    .$where('this.status !== "Draft"')
    .sort({ date: 'desc' })
    .limit(10)
    .exec(function(err, posts) {
      if(err) {
        res.status(500).end();
        console.warn('Failed to get posts for RSS feed ', err.stack);
        return;
      }

      var baseUrl = config.url;

      var feed = new RSS({
        title: config.name,
        description: config.description || '',
        categories: config.categories,
        feed_url: config.baseUrl + '/rss.xml',
        site_url: config.baseUrl,
        image_url: config.baseUrl + '/favicon.ico',
        author: config.name
      });

      for(var i=0; i < posts.length; i++) {
        var post = posts[i];
        feed.item({
          title: post.title,
          description: post.content,
          url: baseUrl + '/blog/' + post.slug,
          categories: post.tags,
          date: post.date
        });
      }

      res.setHeader('Content-Type', 'application/xml');
      res.end(feed.xml());
    });
};