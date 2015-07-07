'use strict';

var express = require('express');
var controller = require('./student.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:creatorID/students', controller.getUserStudents);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.updateTags);
router.delete('/:id', controller.destroy);
router.put('/:id/deleteFromGroup', controller.deleteFromGroup);
router.put('/:id/assignToGroup', controller.assignToGroup);
router.put('/:id/addPack', controller.addPack);
router.put('/:id/addWord', controller.addPack);
router.put('/:id/removeClass', controller.removeClass);

module.exports = router;
