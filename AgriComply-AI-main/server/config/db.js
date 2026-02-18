const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  // Default to blank password for local MySQL setups.
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agricomply_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CRITICAL: Export pool.promise()
module.exports = pool.promise();
