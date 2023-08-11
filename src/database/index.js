import { Pool } from "pg";
import config from "../config";

const { database, user, password, host, port } = config.postgres;

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

async function query(text, params, callback) {
  return pool.query(text, params, callback);
}

export default query;
