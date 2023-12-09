const path = require("path");

const prodConfig = {
  client: "mysql2",
  connection: {
    host: '127.0.0.1',
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
