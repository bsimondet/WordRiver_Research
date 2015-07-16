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
router.put('/:id/assignToClass', controller.assignToClass);
router.put('/:id/assignToGroup', controller.assignToGroup);
router.put('/:id/removeClass', controller.removeClass);
router.put('/:id/removeGroup', controller.removeGroup);

module.exports = router;
