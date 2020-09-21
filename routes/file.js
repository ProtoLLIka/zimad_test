var express = require('express');
var router = express.Router();
var UploadedFile = require('../models/uploadedFile')
const formidable = require('formidable')
var db = require('../database/db_utils.js');
var path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
router.post('/upload', bearerTokenCheck, function (req, res, next) {
  let date = new Date().getTime()
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      file.path = __dirname + '/../storage/' + file.name + '-' + date
    })
    .on('file', async (name, file) => {
      let uploadFile = new UploadedFile(file.name.split('.')[0], file.name.split('.').pop(), file.type, file.size, date)
      await db.insertNewFile(uploadFile);
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
  res.sendStatus(200)
});

router.get('/list', bearerTokenCheck, async function (req, res, next) {
  let listSize = req.query.list_size
  let page = req.query.page
  if (!page) page = 1
  if (!listSize) listSize = 10
  res.send(JSON.parse(JSON.stringify(await db.getFiles(page, listSize))));
});

router.delete('/delete', bearerTokenCheck, async function (req, res, next) {
  const fileId = req.query.id;
  let oldFile = await db.getFileById(fileId);
  let oldFilePath = __dirname + '/../storage/' + oldFile.name + '.' + oldFile.extension + '-' + oldFile.downloadDate
  fs.unlink(oldFilePath, (err) => { if (err) throw err; });
  db.deleteFileById(fileId)
  res.send('res from /delete');
});

router.get('/', bearerTokenCheck, async function (req, res, next) {
  const fileId = req.query.id;
  let file = await db.getFileById(fileId)
  res.send(file);
});

router.get('/download', bearerTokenCheck, async function (req, res, next) {
  const fileId = req.query.id;
  let file = await db.getFileById(fileId);
  let filePath = __dirname + '/../storage/' + file.name + '.' + file.extension + '-' + file.downloadDate
  res.download(path.resolve(filePath), file.name + '.' + file.extension);
});

router.put('/update', bearerTokenCheck, async function (req, res, next) {
  const fileId = req.query.id;
  let date = new Date().getTime()
  let oldFile = await db.getFileById(fileId);
  let oldFilePath = __dirname + '/../storage/' + oldFile.name + '.' + oldFile.extension + '-' + oldFile.downloadDate
  fs.unlink(oldFilePath, (err) => { if (err) throw err; });
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      file.path = __dirname + '/../storage/' + file.name + '-' + date
    })
    .on('file', async (name, file) => {
      let uploadFile = new UploadedFile(file.name.split('.')[0], file.name.split('.').pop(), file.type, file.size, date)
      await db.updateFileById(fileId, uploadFile);
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
  res.send('res from /update');
});

function bearerTokenCheck(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
    if (err) return res.sendStatus(403)
    if (user.session != await db.getUserSessionById(user.userId)) return res.sendStatus(401)
    req.user = user
    next()
  })
}
module.exports = router;
