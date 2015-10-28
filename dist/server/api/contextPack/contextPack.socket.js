/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ContextPack = require('./contextPack.model');

exports.register = function(socket) {
  ContextPack.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ContextPack.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('contextPack:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('contextPack:remove', doc);
}