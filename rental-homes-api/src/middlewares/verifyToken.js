const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../constants");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");

const verifyToken = (req, res, next) => {
  // console.log(req, "req.authorization");
  const token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    "";
  if (!token) {
    return res.status(404).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.notFound,
          fields: { field: "Token" },
        }),
      })
    );
  } else {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send(
          errorResponse({
            message: getI18nMessage({
              msgKey: labelKeys.doesNotMatch,
              fields: { field: "Tokens" },
            }),
          })
        );
      } else {
        req.user = user;
        next();
      }
    });
  }
};

module.exports = verifyToken;
