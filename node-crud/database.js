const Pool = require('pg').Pool

// NOTES: edit if the web is deployed
const pool = new Pool({
  user: 'ludy',
  host: 'localhost',
  database: 'indonesia',
  password: 'astraea12345',
  port: 5432,
});

pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = { pool }
