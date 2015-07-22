'use strict';

var _ = require('lodash');
var Category = require('./category.model');

// Get list of categorys
exports.index = function(req, res) {
  Category.find(function (err, categorys) {
    if(err) { return handleError(res, err); }
    return res.json(200, categorys);
  });
};

exports.getUserCategories = function(req,res) {
  Category.find({creatorID: req.params.creatorID}, function(err, categories) {
    if(err) { return handleError(res, err); }
    return res.json(200, categories);
  });
};

// Get a single category
exports.show = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  Category.create(req.body, function(err, category) {
    if(err) { return handleError(res, err); }
    return res.json(201, category);
  });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Category.findById(req.params.id, function (err, category) {
    if (err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    var updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, category);
    });
  });
};

// Updates an existing contextPack in the DB.
exports.editWordPackName = function(req, res) {
  var wordPackId = req.params.id;
  var newName = req.body.name;

  Category.findById(wordPackId, function (err, wordPack) {
    wordPack.name = newName;
    wordPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Updates an existing contextPack in the DB.
exports.addWordToWordPack = function(req, res) {
  var wordPackId = req.params.id;
  var wordID = req.body.wordID;

  Category.findById(wordPackId, function (err, wordPack) {
    wordPack.words.push(wordID);
    wordPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Updates an existing contextPack in the DB.
exports.removeWordIDFromWordPack = function(req, res) {
  var wordPackId = req.params.id;
  var wordID = req.body.wordID;

  Category.findById(wordPackId, function (err, wordPack) {
    for(var i = 0; i < wordPack.words.length; i++){
      if( wordPack.words[i] == wordID){
        wordPack.words.splice(i, 1);
      }
    }
    wordPack.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

var validationError = function(res, err) {
  return res.json(422, err);
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    category.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
