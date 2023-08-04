import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Blog-Project",
  password: "1564",
  port: 5432,
});

async function query(text, params, callback) {
  return pool.query(text, params, callback);
}

export default query;
