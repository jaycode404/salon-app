import { createPool } from "mysql2/promise";
import {
  MYSQLPORT,
  MYSQLDATABASE,
  MYSQLPASSWORD,
  MYSQLUSER,
  MYSQLHOST,
} from "./config.js";
export const pool = createPool({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
  port: MYSQLPORT,
});
// export const pool = createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
//   port: DB_PORT,
// });

// import { createPool } from "mysql2/promise";
// import { DB_URL } from "./config.js";

// export const pool = createPool({
//   uri: DB_URL || `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
// });
