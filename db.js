// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kalyani@2004',  
  database: 'certificateapp' 
});

db.connect((err) => {
  if (err) {
    console.log('MySQL Connection Error: ', err);
  } else {
    console.log('MySQL Connected');
  }
});

module.exports = db;
