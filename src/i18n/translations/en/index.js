const commonLabels = require("./common");
const cafeLabels = require("./cafes");
const roleLabels = require("./roles");
const fileLabels = require("./files");

module.exports = function ({
  employees = true,
  cafes = true,
  roles = true,
  files = true,
}) {
  return {
    ...commonLabels,
    ...(cafes ? cafeLabels : {}),
    ...(roles ? roleLabels : {}),
    ...(files ? fileLabels : {}),
  };
};
