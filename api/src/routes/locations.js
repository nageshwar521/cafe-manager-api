const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { LOCATIONS_TABLE } = require("../constants");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locations = await db(LOCATIONS_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "locations" },
        }),
        data: { locations },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "locations" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const location = await db(LOCATIONS_TABLE).where("name", data.name).first();
    if (location) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.alreadyExists,
            fields: { field: "location" },
          }),
        })
      );
    }
    const result = await db(LOCATIONS_TABLE).insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "location" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "location" },
        }),
        error,
      })
    );
  }
});

router.get("/:location_id", async (req, res) => {
  const location_id = req.params.location_id;

  try {
    const location = await db(LOCATIONS_TABLE)
      .where("location_id", location_id)
      .first();
    if (!location) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "location" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "location" },
        }),
        data: { location },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "location" },
        }),
        error,
      })
    );
  }
});

router.post("/:location_id", async (req, res) => {
  const location_id = req.params.location_id;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const location = await db(LOCATIONS_TABLE)
      .where("location_id", location_id)
      .first();

    if (!location) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "location" },
          }),
        })
      );
    }

    const result = await db(LOCATIONS_TABLE)
      .where("location_id", location_id)
      .update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "location" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "location" },
        }),
        error,
      })
    );
  }
});

router.delete("/:location_id", async (req, res) => {
  const location_id = req.params.location_id;

  try {
    const location = await db(LOCATIONS_TABLE)
      .where("location_id", location_id)
      .first();
    if (!location) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "location" },
          }),
        })
      );
    }
    const result = await db(LOCATIONS_TABLE)
      .where("location_id", location_id)
      .del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "location" },
        }),
        data: result,
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "location" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
