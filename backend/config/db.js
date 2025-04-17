const mysql = require('mysql2');
const dbConfig = require('./db.config.js');

// 创建连接池
const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取Promise包装的连接池
const promisePool = pool.promise();

module.exports = promisePool; 