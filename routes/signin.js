let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
let mysql = require('mysql');
const connection = mysql.createConnection(require('../database/dbconfig.json'));
connection.connect();
require('dotenv').config()

router.post('/', async function (req, res, next) {
  const idUser = req.body.id;
  const idPass = req.body.password;
  const user = { userId: await getUserId(idUser, idPass) }
  if (user.userId == '') return res.sendStatus(401)
  res.json({ bearerToken: jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' }) })
});

router.post('/new_token', refreshTokenCheck, function (req, res, next) {
  const user = { userId: req.user.userId }
  res.json({
    bearerToken: jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' }),
    refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN)
  })
});

function getUserId(username, password) {
  let userId = '';
  let response = new Promise((resolve, reject) => {
    connection.query(`SELECT user.id FROM user WHERE user.username='${username}' and user.password='${password}'`, function (err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
        userId = rows[0].id
      }
      resolve(userId)
    });
  });
  return response
}

function bearerTokenCheck(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
function refreshTokenCheck(req, res, next) {
  const token = req.body.refreshToken
  if (token == null) return res.sendStatus(400)

  jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(400)
    req.user = user
    next()
  })
}

module.exports = router;
