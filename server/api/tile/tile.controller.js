/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /tiles              ->  index
 * POST    /tiles            ->  create
 * GET     /tiles/:id          ->  show
 * PUT     /tiles/:id          ->  update
 * DELETE  /tiles/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Tile = require('./tile.model');

// Get list of things
exports.index = function(req, res) {
  Tile.find(function (err, students) {
    if(err) { return handleError(res, err); }
    return res.json(200, students);
  });
};

exports.getUserTiles = function(req,res) {
  Tile.find({creatorID: req.params.creatorID}, function(err, tiles) {
    if(err) { return handleError(res, err); }
    return res.json(200, tiles);
  });
};


// Get a single student
exports.show = function(req, res) {
  Tile.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    return res.json(student);
  });
};


// Creates a new student in the DB.
exports.create = function(req, res) {
  Tile.create(req.body, function(err, student) {
    if(err) { return handleError(res, err); }
    return res.json(201, student);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  // deletes _id in req body to not screw things up...
  if(req.body._id){ delete req.body._id }

  // Uses _id provided in request (url) to find pack in database
  Tile.findById(req.params.id, function(err, users) {
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


// Deletes a tile from the DB.
exports.destroy = function(req, res) {
  Tile.findById(req.params.id, function (err, student) {
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
  var tileId = req.body.tileId;
  Tile.findById(tileId, function (err, tile) {
    //console.log(tile);
    for(var i = 0; i < tile.wordPacks.length; i++){
      //console.log("for loop");
      if(tile.wordPacks[i] == category){
        //console.log("splice me");
        tile.wordPacks.splice(i,1);
      }
    }

    tile.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

//exports.updateWord = function(req, res, next) {
//  //var userId = req.user._id;
//
//  var word = req.body.word;
//  var tileId = req.body.tileId;
//
//  tile.findById(tileId, function (err, user) {
//    var found = false;
//    for(var i = 0; i < user.words.length; i++){
//      if(user.words[i].wordName == word){
//        found = true;
//        user.words[i].tileTags.push(tileId);
//      }
//    }
//    if(!found){
//      user.words.push({wordName: word, tileTags: [tileId]});
//    }
//    user.save(function(err) {
//      if (err) return validationError(res, err);
//      res.send(200);
//    });
//  });
//};
//
//function handleError(res, err) {
//  return res.send(500, err);
//}
