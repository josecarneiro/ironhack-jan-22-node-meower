const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  publication: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Publication'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
