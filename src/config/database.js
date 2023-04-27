import dotenv from "dotenv";

dotenv.config();

const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  schema: process.env.DB_SCHEMA,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

export default databaseConfig;
