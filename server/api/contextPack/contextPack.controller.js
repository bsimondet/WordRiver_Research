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

exports.getUserContextPacks = function(req,res) {
  ContextPack.find({creatorID: req.params.creatorID}, function(err, contextPack) {
    if(err) { return handleError(res, err); }
    return res.json(200, contextPack);
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

// Updates an existing contextPack in the DB.
exports.editContextName = function(req, res) {
  var contextId = req.params.id;
  var newName = req.body.name;

  ContextPack.findById(contextId, function (err, contextPack) {
    contextPack.name = newName;
    contextPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

var validationError = function(res, err) {
  return res.json(422, err);
};

// Updates an existing contextPack in the DB.
exports.addWordPackToContextPack = function(req, res) {
  var contextId = req.params.id;
  var wordPackID = req.body.wordPackID;

  ContextPack.findById(contextId, function (err, contextPack) {
    contextPack.wordPacks.push(wordPackID);
    contextPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Updates an existing contextPack in the DB.
exports.removeWordPackFromContextPack = function(req, res) {
  var contextId = req.params.id;
  var wordPackID = req.body.wordPackID;

  ContextPack.findById(contextId, function (err, contextPack) {
    for(var i = 0; i < contextPack.wordPacks.length; i++){
      if(contextPack.wordPacks[i] == wordPackID){
        contextPack.wordPacks.splice(i, 1);
      }
    }
    contextPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
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
