'use strict';
//Fix issue with in artifacts variable; MongoDB has issues with arrays of arrays
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({
  firstName: String,
  lastName: String,
//  artifacts: [[{ //Array of arrays containing JSON objects, with each inner array representing an artifact, and each JSON object representing a word
//    tileID: String, //Word ID
//    contextPack: String //Context pack tag associated with the word used in the JSON object
//}]],
  teachers: [],		//  teacher IDs of (this) student
  words: [],                      //  IDs of words assigned to this student
  wordPacks: [],	            //  IDs of word packs assigned to this student
  contextPacks: [],	//  IDs of context packs assigned to this student
  classList: [{                  //  classes (this) student is assigned to
    _id: String,
    groupList: []           //  IDs of the groups (this) student is assigned in this class item
  }]
});

module.exports = mongoose.model('Student', StudentSchema);

