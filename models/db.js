const mysql = require('mysql');

// 数据库信息
const db = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'',
  port:3306,
  database: 'blog'
});

module.exports = db;
