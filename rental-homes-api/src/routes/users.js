const express = require("express");
// const { uploadFile } = require("../middlewares/upload");
const { getI18nMessage } = require("../i18n");
const {
  errorResponse,
  successResponse,
  isValidEmail,
  dateComparator,
} = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const labelKeys = require("../i18n/labelKeys");
const { USERS_TABLE } = require("../constants");
const { isEmpty, get } = require("lodash");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let users = await db(USERS_TABLE)
      .select("*")
      .select(
        db.raw(
          "CONCAT(`users`.`first_name`, ' ', `users`.`last_name` ) as name"
        )
      );

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Employees" },
        }),
        data: { users },
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "users" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    if (!data.email_address) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.missingRequiredFields,
            fields: { field: "email_address" },
          }),
        })
      );
    }

    const user = await db(USERS_TABLE)
      .where("email_address", data.email_address)
      .first();

    if (user) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.alreadyExists,
            fields: { field: "user" },
          }),
        })
      );
    }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      await db(USERS_TABLE).insert({
        ...data,
        password: hash,
      });
    } else {
      await db(USERS_TABLE).insert({
        ...data,
        password: "",
      });
    }
    const newUser = await db(USERS_TABLE)
      .where("email_address", data.email_address)
      .first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "user" },
        }),
        data: { user: newUser },
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

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db(USERS_TABLE).where("id", userId).first();
    if (!user) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "user" },
          }),
        })
      );
    }
    const { password, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "user" },
        }),
        data: { user: userDetails },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "user" },
        }),
        error,
      })
    );
  }
});

router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const isEmail = isValidEmail(data.email_address);
  let user = null;

  try {
    if (isEmail) {
      user = await db(USERS_TABLE)
        .where("email_address", data.email_address)
        .first();
    }
    if (!user) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "User" },
          }),
          error: { isEmail },
        })
      );
    }

    const result = await db(USERS_TABLE)
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .where("id", userId);

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "User" },
        }),
        data: { user: result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "User" },
        }),
        error,
      })
    );
  }
});

// router.use(uploadFile).post("/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;
//   let newData = {
//     ...data,
//   };

//   try {
//     const user = await db(USERS_TABLE).where("id", userId).first();

//     if (!user) {
//       return res.status(404).send(
//         errorResponse({
//           message: getI18nMessage({
//             msgKey: labelKeys.fieldNotFound,
//             fields: { field: "user" },
//           }),
//           error: { user },
//         })
//       );
//     }
//     // if (req?.uploadedFile?.path_lower) {
//     //   newData = {
//     //     ...data,
//     //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
//     //   };
//     // }

//     await db(USERS_TABLE).update(newData).where("id", userId);
//     const newUser = await db(USERS_TABLE).where("id", userId).first();
//     res.status(200).send(
//       successResponse({
//         message: getI18nMessage({
//           msgKey: labelKeys.updateSuccess,
//           fields: { field: "user" },
//         }),
//         data: { user: newUser },
//       })
//     );
//   } catch (error) {
//     return res.status(500).send(
//       errorResponse({
//         message: getI18nMessage({
//           msgKey: labelKeys.updateError,
//           fields: { field: "user" },
//         }),
//         error: { userId, data },
//       })
//     );
//   }
// });

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db(USERS_TABLE).where("id", userId).first();
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
    const result = await db(USERS_TABLE).where("id", userId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "User" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "User" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
