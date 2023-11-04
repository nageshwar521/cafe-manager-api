const { getI18nMessage } = require(".");
const { errorResponse } = require("../utils");
const labelKeys = require("./labelKeys");

const error500 = ({ res = {}, error = {} }) => {
  return res.status(500).send(
    errorResponse({
      message: getI18nMessage({ msgKey: labelKeys.serverError, error }),
    })
  );
};

module.exports = {
  error500,
};
