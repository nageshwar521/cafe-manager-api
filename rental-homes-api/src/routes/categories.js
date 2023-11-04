const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { CATEGORIES_TABLE } = require("../constants");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db(CATEGORIES_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "categories" },
        }),
        data: { categories },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "categories" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const category = await db(CATEGORIES_TABLE)
      .where("category_name", data.category_name)
      .first();
    if (category) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.addError,
            fields: { field: "category" },
          }),
        })
      );
    }
    const result = await db(CATEGORIES_TABLE).insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "category" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "category" },
        }),
        error,
      })
    );
  }
});

router.get("/:category_id", async (req, res) => {
  const category_id = req.params.category_id;

  try {
    const category = await db(CATEGORIES_TABLE)
      .where("category_id", category_id)
      .first();
    if (!category) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "category" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "category" },
        }),
        data: { category },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "category" },
        }),
        error,
      })
    );
  }
});

router.post("/:category_id", async (req, res) => {
  const category_id = req.params.category_id;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const category = await db(CATEGORIES_TABLE)
      .where("category_id", category_id)
      .first();

    if (!category) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "category" },
          }),
        })
      );
    }

    const result = await db(CATEGORIES_TABLE)
      .where("category_id", category_id)
      .update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "category" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "category" },
        }),
        error,
      })
    );
  }
});

router.delete("/:category_id", async (req, res) => {
  const category_id = req.params.category_id;

  try {
    const category = await db(CATEGORIES_TABLE)
      .where("category_id", category_id)
      .first();
    if (!category) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "category" },
          }),
        })
      );
    }
    const result = await db(CATEGORIES_TABLE)
      .where("category_id", category_id)
      .del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "category" },
        }),
        data: result,
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "category" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
