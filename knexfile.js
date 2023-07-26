require("dotenv").config();
const { devConfig, prodConfig } = require("./db/config");

module.exports = {
  development: devConfig,
  production: prodConfig,
};
