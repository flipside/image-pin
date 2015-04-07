/*jshint node:true */
'use strict';

var _ = require('lodash');
var multiparty = require('multiparty');
var fs = require('fs');
var imageToAscii = require('image-to-ascii');

var checkType = require('../../check-type');
var r = require('../../db');

var imageDownload = function (req, res) {
  var id = req.params.id;
  r
    .table('images')
    .get(id)
    .run(r.conn)
    .then(function (result) {
      res.setHeader('Content-disposition', 'attachment; filename=' + result.fileName);
      res.send(result.file);
    }.bind(this));
};

var imageCreate = function (req, res) {
  if (req.body.image) {
    var image = req.body.image;
    if (!checkType(image.type)) {
      res.status(400).json({
        'error': 'imageError',
        'message': 'Only JPEG/PNG/GIF allowed'
      });
      return;
    }
    if (image.size > 800000) {
      res.status(400).json({
        'error': 'sizeError',
        'message': 'Image must be uner 800kb'
      });
      return;
    }
    image.createdAt = new Date();
    image.likes = [];
    r
      .table('images')
      .insert(image)
      .run(r.conn)
      .then(function (query_result) {
        res.json( {
          id: query_result.generated_keys[0]
        });
      });
  }
};

var deleteImage = function (id) {
  return r.table('images')
    .get(id)
    .delete()
    .run(r.conn);
};

var imageUpdate = function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var imagePath = files.file[0].path;
    var imageId = JSON.parse(fields.data[0]).id;
    fs.readFile(imagePath, function (err, buffer) {
      var image = r.binary(buffer);
      r.table('images')
       .get(imageId)
       .update({
         file: image,
       })
       .run(r.conn)
       .then(function (query_result) {
         res.json({
           id: req.params.id
         });
       });
    });
  });
};

exports.download = imageDownload;
exports.create = imageCreate;
exports.update = imageUpdate;
