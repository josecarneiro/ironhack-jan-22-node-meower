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
    // IF there is a picture,
    // store the url in the picture variable
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
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
      let userIsOwner =
        req.user && String(req.user._id) === String(publication.creator._id);
      res.render('meow-single', { publication, userIsOwner });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('PUBLICATION_NOT_FOUND'));
    });
});

// GET - '/meow/:id/edit' - Loads meow from database, renders meow edit page
meowRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Publication.findOne({ _id: id, creator: req.user._id })
    .then((publication) => {
      if (!publication) {
        throw new Error('PUBLICATION_NOT_FOUND');
      } else {
        res.render('meow-edit', { publication });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// POST - '/meow/:id/edit' - Handles edit form submission.
meowRouter.post(
  '/:id/edit',
  routeGuard,
  fileUpload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    const { message } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    Publication.findOneAndUpdate(
      { _id: id, creator: req.user._id },
      { message, picture }
    )
      .then(() => {
        res.redirect(`/meow/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

// POST - '/meow/:id/delete' - Handles deletion.
meowRouter.post('/:id/delete', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Publication.findOneAndDelete({ _id: id, creator: req.user._id })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = meowRouter;
