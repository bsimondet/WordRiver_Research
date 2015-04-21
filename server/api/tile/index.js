'use strict';

var express = require('express');
var controller = require('./tile.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:creatorID/tiles', controller.getUserTiles);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.patch('/', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/removeFromCategory', controller.removeFromCategory);

module.exports = router;
