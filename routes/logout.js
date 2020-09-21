var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

function bearerTokenDelete(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403)
  })

  jwt.delete()
}
module.exports = router;
