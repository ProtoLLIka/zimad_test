export function getUserId(username, password) {
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
export function insertNewUser(username, password) {
    let response = new Promise(async (resolve, reject) => {
        connection.query(`INSERT INTO user (username, password) VALUES ('${username}', '${password}')`, function (err, rows) {
            if (err) throw err;
        });
        let userId = await getUserId(username, password)
        resolve(userId)
    });
    return response
}