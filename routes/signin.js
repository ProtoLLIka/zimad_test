let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
var db = require('../database/db_utils.js')
require('dotenv').config()

router.post('/', async function (req, res, next) {
  const idUser = req.body.id;
  const idPass = req.body.password;
  const user = { userId: await db.getUserId(idUser, idPass) }
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
