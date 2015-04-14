'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

exports.getUserTiles = function(req, res) {
  return res.status(208);
  //User.find({}, '-salt -hashedPassword', function (err, users) {
  //  if(err) return res.send(500, err);
  //  res.json(200, users);
  //});
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.updatePack = function(req, res, next) {
  var userId = req.user._id;

  //var updates = req.body.user;

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      //user = updates;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

//exports.updateCategories = function(req, res, next) {
//  var userId = req.user._id;
//
//  //var updates = req.body.user;
//  if(req.body._id){delete req.body._id}
//  User.findById(userId, function (err, user) {
//   // user.contextPacks = request.user.contextPacks;
//    if(err){ return handleError(res, err) }
//    if(!user){ return res.send(404) }
//
//    var updated = _.merge(user, req.body, function(a, b) {
//        if(_.isArray(a)) {
//          //return arrayUnique(a.concat(b));
//          return b;
//        } else {
//          // returning undefined lets _.merge use its default merging methods, rather than this callback.
//          return undefined;
//        }
//      });
//      //user = updates;
//    updated.save(function(err){
//      if(err){ return handleError(res, err); }
//      return res.json(200, user);
//    });
//  });
//};

exports.updateCategories = function(req, res) {
  // deletes _id in req body to not screw things up...
  if(req.body._id){ delete req.body._id }

  // Uses _id provided in request (url) to find pack in database
  User.findById(req.params.id, function(err, users) {
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



exports.updateGroups = function(req, res) {
  // deletes _id in req body to not screw things up...
  if(req.body._id){ delete req.body._id }

  // Uses _id provided in request (url) to find pack in database
  User.findById(req.params.id, function(err, users) {
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



exports.updateBucket = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  //var updates = req.body.user;

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      //user = updates;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.deleteTile = function(req, res, next) {
  var userId = req.user._id;

  var word = req.body.word;
  var packId = req.body.packId;
  User.findById(userId, function (err, user) {
    for(var i = 0; i < user.tileBucket.length; i++){
      console.log(word == user.tileBucket[i].wordName);
      if(word == user.tileBucket[i].wordName){
        console.log(word);
        for(var j = 0; j < user.tileBucket[i].tileTags.length; j++){
          if(user.tileBucket[i].tileTags[j] == packId){
            console.log(j);
            user.tileBucket[i].tileTags.splice(j, 1);
          }
        }
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.updatePack = function(req, res, next) {
  var userId = req.user._id;

  var tagName = req.body.tagName;
  var packType = req.body.packType;

  User.findById(userId, function (err, user) {
    user.tileTags.push({"tagName": tagName, "tagType": packType});
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.updateTile = function(req, res, next) {
  var userId = req.user._id;

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

