'use strict';

const express = require('express');
const router = express.Router();
const Publication = require('./../models/publication');
const Like = require('./../models/like');

router.get('/', (req, res, next) => {
  let publications;
  Publication.find()
    .sort({ createdAt: -1 })
    // telling mongoose to populate the creator property
    // tells it to fetch documents from the users collection
    // (since the ref property for creator refers to the User model
    // in the publication schema)
    // and it replaces the values of the publication "creator" properties
    // by the respective user documents
    .populate('creator')
    .then((publicationDocuments) => {
      publications = publicationDocuments;
      if (!req.user) {
        res.render('home', { publications });
      } else {
        const ids = publications.map((publication) => publication._id);
        return Like.find({ publication: { $in: ids }, user: req.user._id });
      }
    })
    .then((likes) => {
      const mappedPublications = publications.map((publication) => {
        const liked = likes.some((like) => {
          return String(like.publication) === String(publication._id);
        });
        return { ...publication.toJSON(), liked };
      });
      res.render('home', { publications: mappedPublications });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
