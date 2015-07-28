'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContextPackSchema = new Schema({
  name: String,
  creatorID: String, //The id of the creator of the category
  wordPacks: [],
  public : Boolean
});

module.exports = mongoose.model('ContextPack', ContextPackSchema);
