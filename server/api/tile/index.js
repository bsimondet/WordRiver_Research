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
//router.patch('/:id/unassign', controller.updateWord);
router.delete('/:id', controller.destroy);
router.put('/:id/removeFromCategory', controller.removeFromCategory);
router.put('/:id/updateWord', controller.updateWord);
router.put('/:id/updateWordNameAndType', controller.updateWordNameAndType);


module.exports = router;
