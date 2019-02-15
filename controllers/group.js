const { promisify } = require('util');
const crypto = require('crypto');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');

/**
 * POST /login
 * Sign in using email and password.
 */

exports.postAddGroup = (req, res, next) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('color', 'Color cannot be blank').notEmpty();
  req.assert('icon', 'Icon cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors);
  }

  const group = new Group({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    icon: req.body.icon,
    children: [],
    parent: req.body.parent,
    members: []
  });

  Group.findOne({ name: req.body.name, color: req.body.color }, (err, existingGroup) => {
    if (err) { return next(err); }
    if (existingGroup) {
      return res.send(existingGroup);
    }
    group.save((err) => {
      if (err) { return next(err); }
      res.send(group);
    });
  });
};

exports.postUpdateGroup = (req, res, next) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('color', 'Color cannot be blank').notEmpty();
  req.assert('id', 'Id cannot be empty').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  Group.findById(req.group.id, (err, group) => {
    if (err) { return next(err); }
    group.name = req.body.name;
    group.description = req.body.description;
    group.color = req.body.color;
    group.icon = req.body.icon;
    group.parent = req.body.parent;
    group.save((err) => {
      if (err) {
        return next(err);
      }
      res.send(group);
    });
  });
};

exports.postUpdateGroup = (req, res, next) => {
  req.assert('id', 'Id cannot be empty').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  Group.findById(req.group.id, (err, group) => {
    if (err) { return next(err); }
    group.name = req.body.name;
    group.description = req.body.description;
    group.color = req.body.color;
    group.icon = req.body.icon;
    group.parent = req.body.parent;
    group.save((err) => {
      if (err) {
        return next(err);
      }
      res.send(group);
    });
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('role').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.send(errors);
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.send(existingUser);
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.send(user);
      });
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};
