'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WordSchema = new Schema({
  name: String, //Word's word
  wordType: String,
  userCreated: Boolean
});

module.exports = mongoose.model('Word', WordSchema);
