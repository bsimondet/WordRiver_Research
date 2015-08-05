'use strict';

var express = require('express');
var controller = require('./wordPack.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:creatorID/categories', controller.getUserCategories);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/', controller.update);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/editWordPackName', controller.editWordPackName);
router.put('/:id/addWordToWordPack', controller.addWordToWordPack);
router.put('/:id/removeWordIDFromWordPack', controller.removeWordIDFromWordPack);

module.exports = router;
