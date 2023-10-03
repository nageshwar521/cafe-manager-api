require("dotenv").config({ path: `.env.development` });
const { devConfig, prodConfig } = require("./src/db/config");

module.exports = {
  development: devConfig,
  production: prodConfig,
};
