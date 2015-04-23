'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TileSchema = new Schema({
  name: String, //Tile's word
  creatorID: String,
  contextTags: [],
active: Boolean, //To check whether a tile has been used any student
  wordType: String
});

module.exports = mongoose.model('Tile', TileSchema);
