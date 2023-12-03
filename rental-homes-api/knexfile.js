const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require("dotenv").config({ path: path.resolve(__dirname, '.env.development') });
}
const { devConfig, prodConfig } = require("./src/db/config");

module.exports = {
  development: devConfig,
  production: prodConfig,
};
