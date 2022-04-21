const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: 300,
      // Ensures that any spaces at the beginning or ending of string are removed
      trim: true
    },
    picture: {
      type: String
    },
    creator: {
      // tell mongoose an object id of another document
      // will be stored in this property
      type: mongoose.Types.ObjectId,
      required: true,
      // tell mongoose that this refers to the id
      // of a document in the users collection
      // (the collection that corresponds to the 'User' model)
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
