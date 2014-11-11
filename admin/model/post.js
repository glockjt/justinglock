var mongoose = require('mongoose');
// var md = require('node-markdown').Markdown;
// var md = require('html-md');
var slug = require('slug');
var bases = require('bases');
var config = require('../../config');

var conn = process.env.MONGO_URL || 'mongodb://localhost:27017/justinBlog';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  conn = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':'
                      + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@'
                      + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/'
                      + process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(conn);

var schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    featureImage: { type: String },
    featureImageCredit: { type: String, trim: true },
    description: { type: String },
    slug: { type: String, lowercase: true },
    // md: { type: String, required: true },
    content: { type: String, required: true },
    // content: { type: String, required: true, set: function(markdown) {
    //     this.md = md(markdown);
    //     return markdown;
    // }},
    status: { type: String, 'default': 'Draft' },
    date: { type: Date, 'default': Date.now },
    modified: { type: Date, 'default': Date.now },
    tags: [ String ]
});

schema.index({ slug: 1 }, { unique: true });

schema.methods = {
  setSlugType: function(type) {
    this.slugType = type;
    return this; // For method chaining
  },
  setSlug: function() {
    if (this.slugType === 'base36') {
      var timestamp = parseInt(this.date.getTime()/1000, 10);
      this.slug = bases.toBase(timestamp, 36);
    } else {
      // Default to regular title slug
      this.slug = slug(this.title);
    }
  }
};

schema.pre('save', function(next) {
  if (this.isNew) { this.setSlug(); }
  next();
});

var Post = module.exports = mongoose.model('Post', schema, 'posts');