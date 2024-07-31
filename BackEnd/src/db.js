import { createPool } from "mysql2/promise";
import {
  MYSQLPORT,
  MYSQLDATABASE,
  MYSQLPASSWORD,
  MYSQLUSER,
  MYSQLHOST,
  MYSQL_URL,
  MYSQL_PUBLIC_URL

} from "./config.js";
const databaseUrl = new URL(MYSQL_PUBLIC_URL
);

export const pool = createPool({
  host: databaseUrl.hostname,
  user: databaseUrl.username,
  password: databaseUrl.password,
  database: databaseUrl.pathname.substring(1),
  port: databaseUrl.port || 3306,
});

// export const pool = createPool({
//   host: MYSQLHOST,
//   user: MYSQLUSER,
//   password: MYSQLPASSWORD,
//   database: MYSQLDATABASE,
//   port: MYSQLPORT,
// });
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
