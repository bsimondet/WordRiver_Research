'use strict';
//Fix issue with in artifacts variable; MongoDB has issues with arrays of arrays
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({
  firstName: String,
  lastName: String,
//  artifacts: [[{ //Array of arrays containing JSON objects, with each inner array representing an artifact, and each JSON object representing a tile
//    tileID: String, //Tile ID
//    contextPack: String //Context pack tag associated with the tile used in the JSON object
//}]],
  teachers: [], //Array of user account IDs associated with this student
//##########^^^This array should never be empty, since a student does not need to exist if it isn't associated with a teacher account.####################
  tileBucket: [], //List of tile IDs the student has access to

  /*
   "classList": [{
     "_id": String,
     "className": String,
     "groupList": []
    }]
  */
  classList: [{
    groupList: []
  }], //Classes with nested groups that a student is in, represented by an array of group ids
  contextTags: [] //Array of category ids, where each id is the category a user has access to
});

module.exports = mongoose.model('Student', StudentSchema);

