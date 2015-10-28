'use strict';

var _ = require('lodash');
var WordPack = require('./wordPack.model.js');

// Get list of word packs
exports.index = function(req, res) {
  WordPack.find(function (err, WordPacks) {
    if(err) { return handleError(res, err); }
    return res.json(200, WordPacks);
  });
};

exports.getUserWordPacks = function(req,res) {
  WordPack.find({creatorID: req.params.creatorID}, function(err, WordPacks) {
    if(err) { return handleError(res, err); }
    return res.json(200, WordPacks);
  });
};

// Get a single wordPack
exports.show = function(req, res) {
  WordPack.findById(req.params.id, function (err, WordPack) {
    if(err) { return handleError(res, err); }
    if(!WordPack) { return res.send(404); }
    return res.json(WordPack);
  });
};

// Creates a new wordPack in the DB.
exports.create = function(req, res) {
  WordPack.create(req.body, function(err, WordPack) {
    if(err) { return handleError(res, err); }
    return res.json(201, WordPack);
  });
};

// Updates an existing wordPack in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  WordPack.findById(req.params.id, function (err, WordPack) {
    if (err) { return handleError(res, err); }
    if(!WordPack) { return res.send(404); }
    var updated = _.merge(WordPack, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, WordPack);
    });
  });
};

// Updates an existing contextPack in the DB.
exports.editWordPackName = function(req, res) {
  var wordPackId = req.params.id;
  var newName = req.body.name;

  WordPack.findById(wordPackId, function (err, wordPack) {
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

  WordPack.findById(wordPackId, function (err, wordPack) {
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

  WordPack.findById(wordPackId, function (err, wordPack) {
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

// Deletes a wordPack from the DB.
exports.destroy = function(req, res) {
  WordPack.findById(req.params.id, function (err, WordPack) {
    if(err) { return handleError(res, err); }
    if(!WordPack) { return res.send(404); }
    WordPack.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
