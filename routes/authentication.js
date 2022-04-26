'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./../models/user');
const fileUpload = require('./../middleware/file-upload');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

const validatePassword = (value) => {
  // Add if statements
  // Regular expressions
  // Other logic to validate password
  return value.length >= 8;
};

router.post('/sign-up', fileUpload.single('picture'), (req, res, next) => {
  const { name, email, password } = req.body;
  let picture;
  if (req.file) {
    picture = req.file.path;
  }
  if (validatePassword(password)) {
    bcryptjs
      .hash(password, 10)
      .then((hash) => {
        return User.create({
          name,
          email,
          passwordHashAndSalt: hash,
          picture
        });
      })
      .then((user) => {
        req.session.userId = user._id;
        return transporter.sendMail({
          from: `"Meower" ${process.env.EMAIL_SENDER}`,
          to: user.email,
          subject: 'Welcome',
          text: 'Welcome to the Meower'
        });
      })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next(new Error('PASSWORD_IS_TOO_SMALL'));
  }
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
