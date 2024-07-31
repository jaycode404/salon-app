// import { createPool } from "mysql2/promise";
// import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } from "./config.js";
// export const pool = createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
//   port: DB_PORT,
// });
import { createPool } from "mysql2/promise";
import { DB_URL } from "./config.js";

export const pool = createPool({
  uri: DB_URL || `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
});
