'use strict';

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'successProjectDeveloper',
    password: 'Success1_',
    database: 'successProjectDatabase',
    port : "3306"
});

connection.connect(err => {
    if (err)
        throw err;
});

connection.on('error', function (err) {
    console.log(err);
    if (err.fatal) connection.end();
});

exports.connection = connection;