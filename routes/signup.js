var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
let mysql = require('mysql');
const connection = mysql.createConnection(require('../database/dbconfig.json'));
connection.connect();
require('dotenv').config();

router.post('/', async function (req, res, next) {
    const userName = req.body.id;
    const userPass = req.body.password;
    if (await getUserId(userName, userPass) != '') return res.sendStatus(409)
    const user = { userId: await insertNewUser(userName, userPass) };
    res.json({
        bearerToken: jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' }),
        refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN)
    })
});

function getUserId(username, password) {
    let response = new Promise((resolve, reject) => {
        let userId = ''
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
function insertNewUser(username, password) {
    let response = new Promise(async (resolve, reject) => {
        connection.query(`INSERT INTO user (username, password) VALUES ('${username}', '${password}')`, function (err, rows) {
            if (err) throw err;
        });
        let userId = await getUserId(username, password)
        resolve(userId)
    });
    return response
}
module.exports = router;
