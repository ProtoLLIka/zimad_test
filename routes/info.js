var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config()
let mysql = require('mysql');
const connection = mysql.createConnection(require('../database/dbconfig.json'));
connection.connect();

router.get('/', bearerTokenCheck, async function (req, res, next) {
  res.json({ username: await getUsernameById(req.user.userId) })
});

function getUsernameById(id) {
  let username = ''
  let response = new Promise((resolve, reject) => {
    connection.query(`SELECT user.username FROM user WHERE user.id='${id}'`, function (err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
        username = rows[0].username
      }
      resolve(username)
    });
  });
  return response
}

function bearerTokenCheck(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.toLowerCase().replace('bearer ')

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
module.exports = router;
