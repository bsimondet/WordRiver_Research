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
router.patch('/:id/group', auth.isAuthenticated(), controller.updateGroups);
router.put('/:id/updatePack', auth.isAuthenticated(), controller.updatePack);
router.put('/:id/updateTile', auth.isAuthenticated(), controller.updateTile);
router.put('/:id/deleteTile', auth.isAuthenticated(), controller.deleteTile);

module.exports = router;
