'use strict'

const config = require('./config').load();
const mysql = require('mysql');

// db 연결 정보 세팅
const db = mysql.createConnection({
  host     : config.mysql.host,
  port     : config.mysql.port,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

// db 연결
db.connect();

module.exports = db;