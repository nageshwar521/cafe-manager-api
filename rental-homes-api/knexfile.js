const path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '.env.development') });
const { devConfig, prodConfig } = require("./src/db/config");

module.exports = {
  development: devConfig,
  production: prodConfig,
};
