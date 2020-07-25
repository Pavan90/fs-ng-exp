const mongoose = require('mongoose');

const postSchema = mongoose.Schema( { // schema is just a blueprint of data
  title: { type: String, required: true },
  content: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema); // MODEL NAME IS POST so the collection name will be posts
