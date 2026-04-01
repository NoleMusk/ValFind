const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "seattle_search",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL belum siap:", err.message);
    return;
  }

  console.log(
    `Terhubung ke MySQL database '${process.env.DB_NAME || "seattle_search"}'`,
  );
  connection.release();
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }

      resolve(results);
    });
  });
}

module.exports = {
  pool,
  query,
};
