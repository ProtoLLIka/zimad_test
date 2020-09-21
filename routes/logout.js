var express = require('express');
var db = require('../database/db_utils.js');
const jwt = require('jsonwebtoken');
var router = express.Router();

router.get('/', bearerTokenCheck, async function (req, res, next) {
  await db.setNewSession(req.user.userId)
  res.send('res from /logout');
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
