/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /students              ->  index
 * POST    /students            ->  create
 * GET     /students/:id          ->  show
 * PUT     /students/:id          ->  update
 * DELETE  /students/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var tile = require('./tile.model');

// Get list of things
exports.index = function(req, res) {
  tile.find(function (err, students) {
    if(err) { return handleError(res, err); }
    return res.json(200, students);
  });
};


// Get a single student
exports.show = function(req, res) {
  tile.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    return res.json(student);
  });
};


// Creates a new student in the DB.
exports.create = function(req, res) {
  tile.create(req.body, function(err, student) {
    if(err) { return handleError(res, err); }
    return res.json(201, student);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  tile.findById(req.params.id, function (err, student) {
    if (err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    var updated = _.merge(student, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, student);
    });
  });
};

// Deletes a tile from the DB.
exports.destroy = function(req, res) {
  tile.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    student.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.updateTile = function(req, res, next) {
  //var userId = req.user._id;

  var word = req.body.word;
  var packId = req.body.packId;

  User.findById(userId, function (err, user) {
    var found = false;
    for(var i = 0; i < user.tileBucket.length; i++){
      if(user.tileBucket[i].wordName == word){
        found = true;
        user.tileBucket[i].tileTags.push(packId);
      }
    }
    if(!found){
      user.tileBucket.push({wordName: word, tileTags: [packId]});
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
