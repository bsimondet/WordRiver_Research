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
var Student = require('./student.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

// Get list of things
exports.index = function(req, res) {
  Student.find(function (err, students) {
    if(err) { return handleError(res, err); }
    return res.json(200, students);
  });
};

exports.getUserStudents = function(req,res) {
  Student.find({teachers: req.params.creatorID}, function(err, students) {
    if(err) { return handleError(res, err); }
    return res.json(200, students);
  });
};

// Get a single student
exports.show = function(req, res) {
  Student.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    return res.json(student);
  });
};


// Creates a new student in the DB.
exports.create = function(req, res) {
  Student.create(req.body, function(err, student) {
    if(err) { return handleError(res, err); }
    return res.json(201, student);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Student.findById(req.params.id, function (err, student) {
    if (err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    var updated = _.merge(student, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, student);
    });
  });
};

exports.updateTags = function(req, res) {
  // deletes _id in req body to not screw things up...
  if(req.body._id){ delete req.body._id }

  // Uses _id provided in request (url) to find pack in database
  Student.findById(req.params.id, function(err, users) {
    // Handle Errors
    if(err){return handleError(res, err) }
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
      if(err){ console.log(err);return handleError(res, err); }
      return res.json(200, users);
    });
  });
};

//Not finished--Working Here!
exports.assignToClass = function(req, res) {
  var userId = req.params.id;
  var classID = req.body.classID;
  var groupList = req.body.groupList;
  Student.findById(userId, function (err, user) {
    user.classList.push({
      "_id": classID,
      "groupList": groupList
    });
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.assignToGroup = function(req, res) {
  var userId = req.body.studentID;
  var classID = req.body.classID;
  var groupID = req.body.groupID;
  Student.findById(userId, function (err, user) {
    for(var i = 0; i < user.classList.length; i++){
      if(classID == user.classList[i]._id){
        user.classList[i].groupList.push(groupID);
      }
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.addWord = function(req, res) {
  var userId = req.params.id;
  var word = req.body.word;
  console.log(packId);
  Student.findById(userId, function (err, user) {

    user.words.push(word);

    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.removeClass = function (req, res) {
  var userId = req.body._id;
  var classID = req.body.classID;
  Student.findById(userId, function (err, user) {
    for (var i = 0; i < user.classList.length; i++) {
      if (user.classList[i]._id == classID) {
        user.classList.splice(i, 1);
      }
    }
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

exports.removeGroup = function (req, res) {
  var userId = req.body._id;
  var groupID = req.body.groupID;
  Student.findById(userId, function (err, user) {
    for (var i = 0; i < user.classList.length; i++) {
      for (var j = 0; j < user.classList[i].groupList.length; j++) {
        if (user.classList[i].groupList[j] == groupID) {
          user.classList[i].groupList.splice(j, 1);
        }
      }
    }
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Student.findById(req.params.id, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.send(404); }
    student.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
