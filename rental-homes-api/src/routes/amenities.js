const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { AMENITIES_TABLE } = require("../constants");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const amenities = await db(AMENITIES_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "amenities" },
        }),
        data: { amenities },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "amenities" },
        }),
        error,
      })
    );
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const amenity = await db(AMENITIES_TABLE)
      .where("amenity_name", data.amenity_name)
      .first();
    if (amenity) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.addError,
            fields: { field: "amenity" },
          }),
        })
      );
    }
    const result = await db(AMENITIES_TABLE).insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "amenity" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.serverError,
          fields: { field: "amenity" },
        }),
        error,
      })
    );
  }
});

router.get("/:amenity_id", async (req, res) => {
  const amenity_id = req.params.amenity_id;

  try {
    const amenity = await db(AMENITIES_TABLE)
      .where("id", amenity_id)
      .first();
    if (!amenity) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "amenity" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "amenity" },
        }),
        data: { amenity },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "amenity" },
        }),
        error,
      })
    );
  }
});

router.post("/:amenity_id", async (req, res) => {
  const amenity_id = req.params.amenity_id;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const amenity = await db(AMENITIES_TABLE)
      .where("id", amenity_id)
      .first();

    if (!amenity) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "amenity" },
          }),
        })
      );
    }

    const result = await db(AMENITIES_TABLE)
      .where("id", amenity_id)
      .update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "amenity" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "amenity" },
        }),
        error,
      })
    );
  }
});

router.delete("/:amenity_id", async (req, res) => {
  const amenity_id = req.params.amenity_id;

  try {
    const amenity = await db(AMENITIES_TABLE)
      .where("id", amenity_id)
      .first();
    if (!amenity) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "amenity" },
          }),
        })
      );
    }
    const result = await db(AMENITIES_TABLE)
      .where("id", amenity_id)
      .del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "amenity" },
        }),
        data: result,
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "amenity" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
