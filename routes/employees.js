const express = require("express");
// const { uploadFile } = require("../middlewares/upload");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse, isValidEmail } = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const labelKeys = require("../i18n/labelKeys");
const {
  EMPLOYEES_TABLE,
  CAFES_TABLE,
  LOCATIONS_TABLE,
} = require("../constants");
const { isEmpty, get } = require("lodash");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { cafeId = "" } = req.query;
    let employees = [];
    if (cafeId !== "undefined" && !isEmpty(cafeId)) {
      employees = await db(EMPLOYEES_TABLE)
        .select("*")
        .select(
          db.raw(
            "CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name` ) as name"
          )
        )
        .where("cafe", cafeId);
    } else {
      employees = await db(EMPLOYEES_TABLE)
        .select("*")
        .select(
          db.raw(
            "CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name` ) as name"
          )
        );
    }

    const newEmployees = await Promise.all(
      employees.map(async (employee) => {
        const cafe = await db(CAFES_TABLE)
          .where("id", employee.cafe)
          .select()
          .first();
        if (get(cafe, "location")) {
          const location = await db(LOCATIONS_TABLE)
            .where("id", cafe.location)
            .select()
            .first();
          return {
            ...employee,
            cafe: {
              ...cafe,
              location,
            },
          };
        } else {
          return {
            ...employee,
            cafe,
          };
        }
      })
    );

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Employees" },
        }),
        data: { employees: newEmployees },
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "employees" },
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

    const employee = await db(EMPLOYEES_TABLE)
      .where("email_address", data.email_address)
      .first();

    if (employee) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.alreadyExists,
            fields: { field: "employee" },
          }),
        })
      );
    }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      await db(EMPLOYEES_TABLE).insert({
        ...data,
        password: hash,
      });
    } else {
      await db(EMPLOYEES_TABLE).insert({
        ...data,
        password: "",
      });
    }
    const newUser = await db(EMPLOYEES_TABLE)
      .where("email_address", data.email_address)
      .first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "employee" },
        }),
        data: { employee: newUser },
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

router.get("/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const employee = await db(EMPLOYEES_TABLE).where("id", employeeId).first();
    if (!employee) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "employee" },
          }),
        })
      );
    }
    const { password, ...employeeDetails } = employee;
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "employee" },
        }),
        data: { employee: employeeDetails },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "employee" },
        }),
        error,
      })
    );
  }
});

router.post("/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId;
  const data = req.body;
  const isEmail = isValidEmail(data.username);

  try {
    if (isEmail) {
      employee = await db(EMPLOYEES_TABLE)
        .where("email_address", data.username)
        .first();
    } else {
      employee = await db(EMPLOYEES_TABLE)
        .where("username", data.username)
        .first();
    }
    if (!employee) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "employee" },
          }),
          error: { isEmail },
        })
      );
    }

    const result = await db(EMPLOYEES_TABLE)
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .where("id", employeeId);

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "employee" },
        }),
        data: { employee: employeeDetails },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "employee" },
        }),
        error: { result },
      })
    );
  }
});

// router.use(uploadFile).post("/:employeeId", async (req, res) => {
//   const employeeId = req.params.employeeId;
//   const data = req.body;
//   let newData = {
//     ...data,
//   };

//   try {
//     const employee = await db(EMPLOYEES_TABLE).where("id", employeeId).first();

//     if (!employee) {
//       return res.status(404).send(
//         errorResponse({
//           message: getI18nMessage({
//             msgKey: labelKeys.fieldNotFound,
//             fields: { field: "employee" },
//           }),
//           error: { employee },
//         })
//       );
//     }
//     // if (req?.uploadedFile?.path_lower) {
//     //   newData = {
//     //     ...data,
//     //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
//     //   };
//     // }

//     await db(EMPLOYEES_TABLE).update(newData).where("id", employeeId);
//     const newUser = await db(EMPLOYEES_TABLE).where("id", employeeId).first();
//     res.status(200).send(
//       successResponse({
//         message: getI18nMessage({
//           msgKey: labelKeys.updateSuccess,
//           fields: { field: "employee" },
//         }),
//         data: { employee: newUser },
//       })
//     );
//   } catch (error) {
//     return res.status(500).send(
//       errorResponse({
//         message: getI18nMessage({
//           msgKey: labelKeys.updateError,
//           fields: { field: "employee" },
//         }),
//         error: { employeeId, data },
//       })
//     );
//   }
// });

router.delete("/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const employee = await db(EMPLOYEES_TABLE).where("id", employeeId).first();
    if (!employee) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "employee" },
          }),
        })
      );
    }
    const result = await db(EMPLOYEES_TABLE).where("id", employeeId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "employee" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "employee" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
