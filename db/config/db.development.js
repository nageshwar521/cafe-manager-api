const path = require("path");

const devConfig = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || "cafe_manager_db",
    user: process.env.DB_USER || "cafe_admin",
    password: process.env.DB_PASSWORD || "cafe1234",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, "../migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "../seeds"),
  },
};

module.exports = { devConfig };
