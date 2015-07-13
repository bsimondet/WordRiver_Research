'use strict';

var _ = require('lodash');
var ContextPack = require('./contextPack.model');

// Get list of contextPacks
exports.index = function(req, res) {
  ContextPack.find(function (err, contextPacks) {
    if(err) { return handleError(res, err); }
    return res.json(200, contextPacks);
  });
};

// Get a single contextPack
exports.show = function(req, res) {
  ContextPack.findById(req.params.id, function (err, contextPack) {
    if(err) { return handleError(res, err); }
    if(!contextPack) { return res.send(404); }
    return res.json(contextPack);
  });
};

// Creates a new contextPack in the DB.
exports.create = function(req, res) {
  ContextPack.create(req.body, function(err, contextPack) {
    if(err) { return handleError(res, err); }
    return res.json(201, contextPack);
  });
};

// Updates an existing contextPack in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ContextPack.findById(req.params.id, function (err, contextPack) {
    if (err) { return handleError(res, err); }
    if(!contextPack) { return res.send(404); }
    var updated = _.merge(contextPack, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contextPack);
    });
  });
};

// Deletes a contextPack from the DB.
exports.destroy = function(req, res) {
  ContextPack.findById(req.params.id, function (err, contextPack) {
    if(err) { return handleError(res, err); }
    if(!contextPack) { return res.send(404); }
    contextPack.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}