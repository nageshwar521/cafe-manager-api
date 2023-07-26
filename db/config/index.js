const { devConfig } = require("./db.development");
const { prodConfig } = require("./db.production");

module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig,
};
