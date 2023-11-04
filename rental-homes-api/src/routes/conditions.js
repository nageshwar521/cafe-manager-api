const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { CONDITIONS_TABLE } = require("../constants");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conditions = await db(CONDITIONS_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "conditions" },
        }),
        data: { conditions },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "conditions" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const condition = await db(CONDITIONS_TABLE)
      .where("condition_name", data.condition_name)
      .first();
    if (condition) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.addError,
            fields: { field: "condition" },
          }),
        })
      );
    }
    const result = await db(CONDITIONS_TABLE).insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "condition" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "condition" },
        }),
        error,
      })
    );
  }
});

router.get("/:condition_id", async (req, res) => {
  const condition_id = req.params.condition_id;

  try {
    const condition = await db(CONDITIONS_TABLE)
      .where("condition_id", condition_id)
      .first();
    if (!condition) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "condition" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "condition" },
        }),
        data: { condition },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "condition" },
        }),
        error,
      })
    );
  }
});

router.post("/:condition_id", async (req, res) => {
  const condition_id = req.params.condition_id;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const condition = await db(CONDITIONS_TABLE)
      .where("condition_id", condition_id)
      .first();

    if (!condition) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "condition" },
          }),
        })
      );
    }

    const result = await db(CONDITIONS_TABLE)
      .where("condition_id", condition_id)
      .update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "condition" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "condition" },
        }),
        error,
      })
    );
  }
});

router.delete("/:condition_id", async (req, res) => {
  const condition_id = req.params.condition_id;

  try {
    const condition = await db(CONDITIONS_TABLE)
      .where("condition_id", condition_id)
      .first();
    if (!condition) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "condition" },
          }),
        })
      );
    }
    const result = await db(CONDITIONS_TABLE)
      .where("condition_id", condition_id)
      .del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "condition" },
        }),
        data: result,
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "condition" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
