/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var WordPack = require('./wordPack.model.js');

exports.register = function(socket) {
  WordPack.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  WordPack.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('wordPack:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('wordPack:remove', doc);
}
