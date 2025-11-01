// db.js - handles MariaDB connection

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',         // change if your MariaDB username is different
  password: '',          // add your MariaDB password if you have one
  database: 'shopdb',    // make sure this database exists (we’ll create it soon)
  connectionLimit: 5
});

module.exports = pool;
