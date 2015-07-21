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

exports.removeStudentID = function(req, res) {
  var userId = req.user._id;
  var studentID = req.body.studentID;

  User.findById(userId, function (err, user) {
    for(var i = 0 ; i < user.studentList.length; i++){
      if(user.studentList[i] == studentID){
        user.studentList.splice(i, 1);
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.removeWordID = function(req, res) {
  var userId = req.user._id;
  var wordID = req.body.wordID;

  User.findById(userId, function (err, user) {
    for(var i = 0 ; i < user.words.length; i++){
      if(user.words[i] == wordID){
        user.words.splice(i, 1);
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.removeCategoryID = function(req, res) {
  var userId = req.user._id;
  var categoryID = req.body.categoryID;

  User.findById(userId, function (err, user) {
    for(var i = 0 ; i < user.wordPacks.length; i++){
      if(user.wordPacks[i] == categoryID){
        user.wordPacks.splice(i, 1);
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

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

exports.updateClassName = function(req, res) {
  var id = req.params.id;
  var className = req.body.className;
  var classID = req.body.classID;
  User.findById(id, function (err, users) {
    for(var index = 0; index < users.classList.length; index++){
      if(users.classList[index]._id == classID){
        users.classList[index].className = className;
      }
    }
    // Saves to database
    users.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, users);
    });
  });
};

exports.updateGroupName = function(req, res) {
  var id = req.params.id;
  var groupName = req.body.groupName;
  var groupID = req.body.groupID;
  User.findById(id, function (err, users) {
    for(var index = 0; index < users.classList.length; index++){
      for(var index2 = 0; index2 < users.classList[index].groupList.length; index2++){
        if(users.classList[index].groupList[index2]._id == groupID) {
          users.classList[index].groupList[index2].groupName = groupName;
        }
      }
    }
    // Saves to database
    users.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, users);
    });
  });
};

exports.updateClasses = function(req, res) {
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

exports.deleteClass = function(req, res) {
  var userId = req.params.id;
  var myClassID = req.body.myClassID;
  User.findById(userId, function (err, user) {
    for(var i = 0 ; i < user.classList.length; i++){
        if(user.classList[i]._id == myClassID){
        user.classList.splice(i, 1);
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.deleteGroup = function(req, res) {
  var userId = req.params.id;
  var groupID = req.body.groupID;
  User.findById(userId, function (err, user) {
    for(var index = 0 ; index < user.classList.length; index++){
      for(var index2 = 0; index2 < user.classList[index].groupList.length; index2++){
        if(user.classList[index].groupList[index2]._id == groupID) {
          user.classList[index].groupList.splice(index2, 1);
        }
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
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
    for(var i = 0; i < user.words.length; i++){
      console.log(word == user.words[i].wordName);
      if(word == user.words[i].wordName){
        console.log(word);
        for(var j = 0; j < user.words[i].wordPacks.length; j++){
          if(user.words[i].wordPacks[j] == packId){
            console.log(j);
            user.words[i].wordPacks.splice(j, 1);
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

exports.addClass = function(req, res, next) {
  var userId = req.user._id;

  var className = req.body.className;

  User.findById(userId, function (err, user) {
    user.classList.push({
      "className": className,
      "groupList": []
    });
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.addStudent = function(req, res, next) {
  var userId = req.user._id;
  var studentID = req.body.studentID;

  User.findById(userId, function (err, user) {
    user.studentList.push(studentID);
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.addContextID = function(req, res, next) {
  var userId = req.user._id;

  var contextID = req.body.contextID;

  User.findById(userId, function (err, user) {
    user.wordPacks.push(contextID);
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.addWordID = function(req, res, next) {
  var userId = req.user._id;
  var wordID = req.body.wordID;

  User.findById(userId, function (err, user) {
    user.words.push(wordID);
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.addWordIDtoGroup = function(req, res, next) {
  var userId = req.user._id;
  var classID = req.body.classID;
  var groupID = req.body.groupID;
  var wordID = req.body.wordID;

  User.findById(userId, function (err, user) {
    for(var i = 0; i < user.classList.length; i++){
      if(user.classList[i]._id == classID){
        for(var i2 = 0; i2 < user.classList[i].groupList.length; i2++){
          if(user.classList[i].groupList[i2]._id == groupID && user.classList[i].groupList[i2].words.indexOf(wordID) == -1){
            user.classList[i].groupList[i2].words.push(wordID);
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

exports.addWordPackIDtoGroup = function(req, res, next) {
  var userId = req.user._id;
  var classID = req.body.classID;
  var groupID = req.body.groupID;
  var wordPackID = req.body.wordPackID;

  User.findById(userId, function (err, user) {
    for(var i = 0; i < user.classList.length; i++){
      if(user.classList[i]._id == classID){
        for(var i2 = 0; i2 < user.classList[i].groupList.length; i2++){
          if(user.classList[i].groupList[i2]._id == groupID && user.classList[i].groupList[i2].wordPacks.indexOf(wordPackID) == -1){
            user.classList[i].groupList[i2].wordPacks.push(wordPackID);
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

exports.removeWordPackIDfromGroup = function(req, res, next) {
  var userId = req.user._id;
  var classID = req.body.classID;
  var groupID = req.body.groupID;
  var wordPackID = req.body.wordPackID;

  User.findById(userId, function (err, user) {
    for(var i = 0; i < user.classList.length; i++){
      if(user.classList[i]._id == classID){
        for(var i2 = 0; i2 < user.classList[i].groupList.length; i2++){
          if(user.classList[i].groupList[i2]._id == groupID){
            for(var i3 = 0; i3 < user.classList[i].groupList[i2].wordPacks.length; i3++){
              if(user.classList[i].groupList[i2].wordPacks[i3] == wordPackID){
                user.classList[i].groupList[i2].wordPacks.splice(i3, 1);
              }
            }
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

exports.updateWord = function(req, res, next) {
  var userId = req.user._id;

  var word = req.body.word;
  var packId = req.body.packId;

  User.findById(userId, function (err, user) {
    var found = false;
    for(var i = 0; i < user.words.length; i++){
      if(user.words[i].wordName == word){
        found = true;
        user.words[i].tileTags.push(packId);
      }
    }
    if(!found){
      user.words.push({wordName: word, tileTags: [packId]});
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

