import { createPool } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "./config.js";
export const pool = createPool({
  host: "monorail.proxy.rlwy.net",
  port: 32340,
  user: "root",
  password: "root",
  database: "railway",
});