const express = require('express');
const Publication = require('./../models/publication');
const routeGuard = require('./../middleware/route-guard');

const meowRouter = new express.Router();

// GET - '/meow/create' - Renders meow creation page
meowRouter.get('/create', routeGuard, (req, res) => {
  res.render('meow-create');
});

// POST - '/meow/create' - Handles new meow creation
meowRouter.post('/create', routeGuard, (req, res, next) => {
  const { message } = req.body;
  // Call create method on Publication model
  Publication.create({
    message,
    creator: req.user._id
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

// GET - '/meow/:id' - Loads meow from database, renders single meow page

// GET - '/meow/:id/edit' - Loads meow from database, renders meow edit page
// POST - '/meow/:id/edit' - Handles edit form submission.
// POST - '/meow/:id/delete' - Handles deletion.

module.exports = meowRouter;
