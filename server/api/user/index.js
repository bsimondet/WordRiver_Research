'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id/tile', auth.isAuthenticated(), controller.getUserTiles);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/updatePack', auth.isAuthenticated(), controller.updatePack);
router.put('/:id/updateBucket', auth.isAuthenticated(), controller.updateBucket);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.patch('/:id/category', auth.isAuthenticated(), controller.updateCategories);
router.patch('/:id/class', auth.isAuthenticated(), controller.updateClasses);
router.put('/:id/class', auth.isAuthenticated(), controller.updateClassName);
router.put('/:id/group', auth.isAuthenticated(), controller.updateGroupName);
router.put('/:id/updatePack', auth.isAuthenticated(), controller.updatePack);
router.put('/:id/updateWord', auth.isAuthenticated(), controller.updateWord);
router.put('/:id/deleteTile', auth.isAuthenticated(), controller.deleteTile);
router.put('/:id/deleteClass', auth.isAuthenticated(), controller.deleteClass);
router.put('/:id/deleteGroup', auth.isAuthenticated(), controller.deleteGroup);
router.put('/:id/addClass', auth.isAuthenticated(), controller.addClass);
router.put('/:id/addStudent', auth.isAuthenticated(), controller.addStudent);
router.put('/:id/addContextID', auth.isAuthenticated(), controller.addContextID);
router.put('/:id/addWordID', auth.isAuthenticated(), controller.addWordID);
router.put('/:id/removeCategoryID', auth.isAuthenticated(), controller.removeCategoryID);
router.put('/:id/removeWordID', auth.isAuthenticated(), controller.removeWordID);
router.put('/:id/removeStudentID', auth.isAuthenticated(), controller.removeStudentID);
router.put('/:id/addWordIDtoGroup', auth.isAuthenticated(), controller.addWordIDtoGroup);
router.put('/:id/addWordPackIDtoGroup', auth.isAuthenticated(), controller.addWordPackIDtoGroup);
router.put('/:id/removeWordPackIDfromGroup', auth.isAuthenticated(), controller.removeWordPackIDfromGroup);

module.exports = router;
