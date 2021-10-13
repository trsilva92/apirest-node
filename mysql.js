const mysql = require('mysql')
require('./nodemon.json').config

const pool = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
})

exports.pool = pool