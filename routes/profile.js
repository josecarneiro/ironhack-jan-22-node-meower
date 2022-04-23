const express = require('express');
const User = require('./../models/user');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const Publication = require('../models/publication');

const profileRouter = new express.Router();

// GET - '/profile/:id/edit' - Loads user and renders profile edit view.
profileRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('profile-edit', { profile: req.user });
});

// POST - '/profile/:id/edit' - Handles profile edit form submission.
profileRouter.post(
  '/edit',
  routeGuard,
  fileUpload.single('picture'),
  (req, res, next) => {
    const id = req.user._id;
    const { name, email } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    User.findByIdAndUpdate(id, { name, email, picture })
      .then(() => {
        res.redirect(`/profile/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

// GET - '/profile/:id' - Loads user with params.id from collection, renders profile page.
profileRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  let user;
  User.findById(id)
    .then((userDocument) => {
      user = userDocument;
      if (!user) {
        throw new Error('PROFILE_NOT_FOUND');
      } else {
        return Publication.find({ creator: id }).sort({ createdAt: -1 });
      }
    })
    .then((publications) => {
      let userIsOwner = req.user && String(req.user._id) === id;
      res.render('profile', { profile: user, publications, userIsOwner });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('PROFILE_NOT_FOUND'));
    });
});

module.exports = profileRouter;
