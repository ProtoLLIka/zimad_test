var mysql = require('mysql');
var uuid = require('uuid');
const connection = mysql.createConnection(require('./dbconfig.json'));
connection.connect();

exports.getUserId = function (username, password) {
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
exports.insertNewUser = function (username, password) {
    let session = uuid.v4()
    let response = new Promise(async (resolve, reject) => {
        connection.query(`INSERT INTO user (username, password, session) VALUES ('${username}', '${password}', '${session}')`, function (err, rows) {
            if (err) throw err;
        });
        resolve(await exports.getUserId(username, password))
    });
    return response
}
exports.getUsernameById = function (id) {
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
exports.getUserSessionById = function (id) {
    let session = ''
    let response = new Promise((resolve, reject) => {
        connection.query(`SELECT user.session FROM user WHERE user.id=${id}`, function (err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                session = rows[0].session
            }
            resolve(session)
        });
    });
    return response
}
exports.getFileId = function (file) {
    let response = new Promise((resolve, reject) => {
        let fileId = ''
        connection.query(`SELECT files.id FROM files WHERE files.downloadDate='${file.downloadDate}'`, function (err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                fileId = rows[0].id
            }
            resolve(fileId)
        });
    });
    return response
}
exports.insertNewFile = function (file) {
    let response = new Promise(async (resolve, reject) => {
        connection.query(`INSERT INTO files (name,extension, MIMEtype, size, downloadDate) 
        VALUES ('${file.name}', '${file.extension}', '${file.MIMEtype}', ${file.size}, ${file.downloadDate})`, function (err, rows) {
            if (err) throw err;
        });
        resolve(await exports.getFileId(file))
    });
    return response
}
exports.updateFileById = function (id, file) {
    let response = new Promise((resolve, reject) => {
        connection.query(`UPDATE files 
        SET 
        files.name = '${file.name}',
        files.extension = '${file.extension}',
        files.MIMEtype = '${file.MIMEtype}',
        files.size = ${file.size},
        files.downloadDate = ${file.downloadDate}
        WHERE files.id=${id}`,
            function (err, rows) {
                if (err) throw err;
                let file = ''
                if (rows.length > 0) {
                    file = rows[0]
                }
                resolve(file)
            });
    });
    return response
}
exports.deleteFileById = function (id) {
    let response = new Promise((resolve, reject) => {
        connection.query(`DELETE FROM files WHERE id ='${id}'`, function (err, rows) {
            if (err) throw err;
            resolve(true)
        });
    });
    return response
}
exports.getFileById = function (id) {
    let response = new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM files WHERE files.id='${id}'`, function (err, rows) {
            if (err) throw err;
            let file = ''
            if (rows.length > 0) {
                file = rows[0]
            }
            resolve(file)
        });
    });
    return response
}
exports.getFiles = function (page, listSize) {
    let response = new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM files ORDER BY id DESC LIMIT ${(page - 1) * listSize}, ${listSize}`, function (err, rows) {
            if (err) throw err;
            resolve(rows)
        });
    });
    return response
}
exports.setNewSession = function (id) {
    let session = uuid.v4()
    let response = new Promise((resolve, reject) => {
        connection.query(`UPDATE user 
        SET 
        user.session = '${session}'
        WHERE user.id=${id}`,
            function (err, rows) {
                if (err) throw err;
                let user = ''
                if (rows.length > 0) {
                    user = rows[0]
                }
                resolve(user)
            });
    });
    return response
}