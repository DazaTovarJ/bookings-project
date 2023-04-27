import mysql2 from "mysql2/promise";
import databaseConfig from "../config/database.js";

const pool = mysql2.createPool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.schema,
});

pool
  .getConnection()
  .then((con) => {
    console.log("Connected to database!");
    con.release();
  })
  .catch((err) => {
    console.log("Failed to connect to database!");
    console.trace(err);
  });

export default pool;
