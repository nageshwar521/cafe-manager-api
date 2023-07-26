const commonLabels = require("./common");
const cafeLabels = require("./cafes");
const roleLabels = require("./roles");

module.exports = function ({ employees = true, cafes = true, roles = true }) {
  return {
    ...commonLabels,
    ...(cafes ? cafeLabels : {}),
    ...(roles ? roleLabels : {}),
  };
};
