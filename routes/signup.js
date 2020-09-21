var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var db = require('../database/db_utils.js');
require('dotenv').config();

router.post('/', async function (req, res, next) {
    const userName = req.body.id;
    const userPass = req.body.password;
    if (await db.getUserId(userName, userPass) != '') return res.sendStatus(409)
    const user = { userId: await db.insertNewUser(userName, userPass) };
    res.json({
        bearerToken: jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' }),
        refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN)
    })
});

module.exports = router;
