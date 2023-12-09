const path = require("path");
require("dotenv").config({ path: `.env.production` });

const prodConfig = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: path.join(__dirname, "../migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "../seeds"),
  },
};

module.exports = { prodConfig };
