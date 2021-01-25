const mysql = require('mysql');
const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'caloriebuddy',
  password: 's3cr3t',
  database: 'food_db',
  insecureAuth: true,
});

conn.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

module.exports = conn;
