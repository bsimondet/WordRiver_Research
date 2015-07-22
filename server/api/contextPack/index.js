'use strict';

var express = require('express');
var controller = require('./contextPack.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:creatorID/contextPacks', controller.getUserContextPacks);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/editContextName', controller.editContextName);

module.exports = router;
