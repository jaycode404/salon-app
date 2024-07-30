import { createPool } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "./config.js";
export const pool = createPool({
  host: "mysql.railway.internal",
  port: 3306,
  user: "root",
  password: "cqufjoYjagdBkKqcVefYPgLsbxyiPFXd",
  database: "railway",
});
