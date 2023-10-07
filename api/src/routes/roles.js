const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { ROLES_TABLE } = require("../constants");

/*
R0 - admin
R1 - manager
R2 - chef
R3 - waiter
R4 - cleaner
*/

const router = express.Router();
const ROLES = ["R0", "R1", "R2", "R3", "R4"];

router.get("/", async (req, res) => {
  try {
    const roles = await db(ROLES_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "roles" },
        }),
        data: { roles },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "cafes" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    if (!ROLES.includes(data.role_id)) {
      throw getI18nMessage({
        msgKey: labelKeys.unknownRole,
        fields: { field: "role" },
      });
    }
    const role = await db(ROLES_TABLE).where("role_id", data.role_id).first();
    if (role) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.addError,
            fields: { field: "role" },
          }),
        })
      );
    }
    const result = await db(ROLES_TABLE).insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "role" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "role" },
        }),
        error,
      })
    );
  }
});

router.get("/:role_id", async (req, res) => {
  const role_id = req.params.role_id;

  try {
    const role = await db(ROLES_TABLE).where("role_id", role_id).first();
    if (!role) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "role" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "role" },
        }),
        data: { role },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "role" },
        }),
        error,
      })
    );
  }
});

router.post("/:role_id", async (req, res) => {
  const role_id = req.params.role_id;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const role = await db(ROLES_TABLE).where("role_id", role_id).first();

    if (!role) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "role" },
          }),
        })
      );
    }

    const result = await db(ROLES_TABLE)
      .where("role_id", role_id)
      .update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "role" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "role" },
        }),
        error,
      })
    );
  }
});

router.delete("/:role_id", async (req, res) => {
  const role_id = req.params.role_id;

  try {
    const role = await db(ROLES_TABLE).where("role_id", role_id).first();
    if (!role) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "role" },
          }),
        })
      );
    }
    const result = await db(ROLES_TABLE).where("role_id", role_id).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "role" },
        }),
        data: result,
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "role" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
