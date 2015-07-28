'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  isWordType: Boolean, //True means the context pack should be treated as a word type category.
                       // Word type categories automatically catch all tiles that are tagged with the name of the category as their type.
                       //For example, creating a "Noun" word type category through the Word manger page will give the user the option to add "Noun" as a type of word.
                       //When a word is given this tag, it will appear in the "Noun" Word type category.
  creatorID: String, //The id of the creator of the category
  words: [],
  public : Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
