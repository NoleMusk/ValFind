const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  hasDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres",
        database: process.env.PGDATABASE || "seattle_search",
        ssl: false,
      },
);

pool
  .query("SELECT current_database() AS database_name")
  .then((result) => {
    console.log(
      `Terhubung ke PostgreSQL database '${result.rows[0].database_name}'`,
    );
  })
  .catch((error) => {
    console.error("PostgreSQL belum siap:", error.message);
  });

async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

module.exports = {
  pool,
  query,
};
