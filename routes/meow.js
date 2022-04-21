const express = require('express');
const Publication = require('./../models/publication');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');

const meowRouter = new express.Router();

// GET - '/meow/create' - Renders meow creation page
meowRouter.get('/create', routeGuard, (req, res) => {
  res.render('meow-create');
});

// POST - '/meow/create' - Handles new meow creation
meowRouter.post(
  '/create',
  routeGuard,
  fileUpload.single('picture'),
  (req, res, next) => {
    const { message } = req.body;
    const picture = req.file.path;
    // Call create method on Publication model
    Publication.create({
      message,
      picture,
      creator: req.user._id
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  }
);

// GET - '/meow/:id' - Loads meow from database, renders single meow page
meowRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Publication.findById(id)
    .populate('creator')
    .then((publication) => {
      res.render('meow-single', { publication });
    })
    .catch((error) => {
      next(error);
    });
});

// GET - '/meow/:id/edit' - Loads meow from database, renders meow edit page
// POST - '/meow/:id/edit' - Handles edit form submission.
// POST - '/meow/:id/delete' - Handles deletion.

module.exports = meowRouter;
