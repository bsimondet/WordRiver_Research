'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TileSchema = new Schema({
  name: String, //Tile's word
  wordType: String,
  userCreated: Boolean
});

module.exports = mongoose.model('Tile', TileSchema);
