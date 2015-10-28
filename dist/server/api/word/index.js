'use strict';

var express = require('express');
var controller = require('./word.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:creatorID/words', controller.getUserWords);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.patch('/', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/removeFromWordPack', controller.removeFromWordPack);


module.exports = router;
