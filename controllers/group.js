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
    parent: req.body.parent,
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

exports.postUpdateGroupMembers = (req, res, next) => {
  req.assert('id', 'Id cannot be empty').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  Group.findById(req.group.id, (err, group) => {
    if (err) { return next(err); }
    group.members = req.body.members;
    group.save((err) => {
      if (err) {
        return next(err);
      }
      res.send(group);
    });
  });
};

exports.postUpdateGroupChildren = (req, res, next) => {
  req.assert('id', 'Id cannot be empty').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  Group.findById(req.group.id, (err, group) => {
    if (err) { return next(err); }
    group.children = req.body.children;
    group.save((err) => {
      if (err) {
        return next(err);
      }
      res.send(group);
    });
  });
};

exports.getGroupById = (req, res, next) => {
  req.assert('id', 'Id cannot be empty').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  Group.findById(req.query.id, (err, group) => {
    if (err) { return next(err); }
    res.send(group);
  });
};

exports.getAllGroups = (req, res, next) => {
  req.assert('offset', 'Offset cannot be empty').notEmpty();
  req.assert('pagination', 'Pagination cannot be empty').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors);
  }

  Group.find({})
    .limit(parseInt(req.query.pagination, 10))
    .skip(parseInt(req.query.offset, 10))
    .exec((err, groups) => {
      if (err) { return next(err); }
      console.log(groups);
      res.send(JSON.stringify(groups));
    });
};
