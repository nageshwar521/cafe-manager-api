const path = require("path");
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const config = {
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
    directory: path.join(__dirname, './src/db/migrations'),
  },
  seeds: {
    directory: path.join(__dirname, "./src/db/seeds"),
  },
};

module.exports = config;
