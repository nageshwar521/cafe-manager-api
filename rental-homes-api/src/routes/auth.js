const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  ACCESS_TOKEN_SECRET,
  TOKEN_EXPIRE_TIME,
  USERS_TABLE,
} = require("../constants");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse, isValidEmail } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");

let refreshTokens = [];

const router = express.Router();

router.post("/login", async (req, res) => {
  const data = req.body;
  const isEmail = isValidEmail(data.username);

  try {
    let user = null;
    if (isEmail) {
      user = await db(USERS_TABLE)
        .where("email_address", data.username)
        .first();
    } else {
      user = await db(USERS_TABLE).where("username", data.username).first();
    }
    // console.log(user);

    if (!user) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "User" },
          }),
        })
      );
    }
    const validPassword = await bcrypt.compare(data.password, user.password);
    console.log(validPassword, "validPassword");
    if (!validPassword) {
      return res.status(401).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.doesNotMatch,
            fields: { fields: "Username and Password" },
          }),
        })
      );
    }
    const accessToken = jwt.sign(
      { username: data.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRE_TIME }
    );
    const refreshToken = jwt.sign(
      { username: data.username },
      ACCESS_TOKEN_SECRET
    );
    console.log(user, accessToken);
    const { password, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.successMessage,
          fields: { field: "Login" },
        }),
        data: {
          accessToken,
          refreshToken,
          expiresIn: TOKEN_EXPIRE_TIME,
          user: userDetails,
        },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.errorMessage,
          fields: { field: "Login" },
        }),
        error,
      })
    );
  }
});

router.post("/signup", async (req, res) => {
  const data = req.body;

  if (!(data.username && data.password)) {
    let requiredMessage = "";

    if (!data.username) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Username" },
          }),
        })
      );
    }
    if (!data.password) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Password" },
          }),
        })
      );
    }
  }
  try {
    const user = await db(USERS_TABLE).where("username", data.username).first();
    console.log(user);

    if (user) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.alreadyExists,
            fields: { field: "User" },
          }),
        })
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    const result = await db(USERS_TABLE).insert({
      ...data,
      email_address: data.username,
      password: hash,
    });
    res.status(201).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.successMessage,
          fields: { field: "Registration" },
        }),
        data: { user: result },
      })
    );
  } catch (error) {
    res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
        }),
        error,
      })
    );
  }
});

router.post("/token", (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.notFound,
            fields: { field: "Token" },
          }),
        })
      );
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(500).send(
          errorResponse({
            message: getI18nMessage({
              msgKey: labelKeys.doesNotMatch,
              fields: { field: "Token" },
            }),
          })
        );
      }

      const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
        expiresIn: "20m",
      });

      res.status(200).send(
        successResponse({
          message: getI18nMessage({
            msgKey: labelKeys.successMessage,
            fields: { field: "Token refresh" },
          }),
          data: { accessToken },
        })
      );
    });
  } catch (error) {
    res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
        }),
      })
    );
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;

  try {
    refreshTokens = refreshTokens.filter((t) => t !== token);

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.successMessage,
          fields: { field: "Logout" },
        }),
      })
    );
  } catch (error) {
    res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
        }),
      })
    );
  }
});

module.exports = router;
