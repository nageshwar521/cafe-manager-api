const language = process.env.language || "en";
const getAllLables = require("./translations")[language];

const getI18nMessage = (options = {}) => {
  const { msgKey = "", fields = {}, flags = {} } = options;
  if (!msgKey) return "msgKey not found!";
  const allLabels = getAllLables(flags) || {};
  const labelStr = allLabels[msgKey];
  const newFields = Object.keys(fields).reduce((newObj, field) => {
    newObj[`{${field}}`] = fields[field];
    return newObj;
  }, {});
  return (
    labelStr.replace(/{field}|{field1}|{field2}/gi, function (matched) {
      return newFields[matched] || matched;
    }) || msgKey
  );
};

module.exports = { getI18nMessage };
