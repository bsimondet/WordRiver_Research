/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /words              ->  index
 * POST    /words            ->  create
 * GET     /words/:id          ->  show
 * PUT     /words/:id          ->  update
 * DELETE  /words/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Word = require('./word.model.js');

// Get list of things
exports.index = function(req, res) {
  Word.find(function (err, students) {
    if(err) { return handleError(res, err); }
    return res.json(200, students);
  });
};

exports.getUserWords = function(req,res) {
  Word.find({creatorID: req.params.creatorID}, function(err, words) {
    if(err) { return handleError(res, err); }
    return res.json(200, words);
  });
};


// Get a single student
exports.show = function(req, res) {
  Word.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    return res.json(student);
  });
};


// Creates a new student in the DB.
exports.create = function(req, res) {
  Word.create(req.body, function(err, student) {
    if(err) { return handleError(res, err); }
    return res.json(201, student);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  // deletes _id in req body to not screw things up...
  if(req.body._id){ delete req.body._id }

  // Uses _id provided in request (url) to find pack in database
  Word.findById(req.params.id, function(err, users) {
    // Handle Errors
    if(err){ return handleError(res, err) }
    if(!users){ return res.send(404) }

    // Merging request body and pack from DB. Special callback for arrays!
    var updated = _.merge(users, req.body, function(a, b) {
      if(_.isArray(a)) {
        //return arrayUnique(a.concat(b));
        return b;
      } else {
        // returning undefined lets _.merge use its default merging methods, rather than this callback.
        return undefined;
      }
    });

    // Saves to database
    updated.save(function(err){
      if(err){ return handleError(res, err); }
      return res.json(200, users);
    });
  });
};


// Deletes a word from the DB.
exports.destroy = function(req, res) {
  Word.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    student.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.removeFromWordPack = function(req, res, next) {
  //var userId = req.user._id;
  console.log("function called");
  var category = req.body.category;
  var wordId = req.body.wordId;
  Word.findById(wordId, function (err, word) {
    //console.log(word);
    for(var i = 0; i < word.wordPacks.length; i++){
      //console.log("for loop");
      if(word.wordPacks[i] == category){
        //console.log("splice me");
        word.wordPacks.splice(i,1);
      }
    }

    word.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};
