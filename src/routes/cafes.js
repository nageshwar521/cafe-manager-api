const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const {
  CAFES_TABLE,
  LOCATIONS_TABLE,
  EMPLOYEES_TABLE,
} = require("../constants");
const { isEmpty } = require("lodash");
const uploadLocal = require("../middlewares/uploadLocal");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { locationId = "" } = req.query;
    let cafes = [];
    if (locationId !== "undefined" && !isEmpty(locationId)) {
      cafes = await db(CAFES_TABLE).where("location", locationId).select();
    } else {
      cafes = await db(CAFES_TABLE).select();
    }

    const newCafes = await Promise.all(
      cafes.map(async (cafe) => {
        const location = await db(LOCATIONS_TABLE)
          .where("id", cafe.location)
          .select()
          .first();
        const employees = await db(EMPLOYEES_TABLE)
          .where("cafe", cafe.id)
          .count("id as count")
          .first();
        return {
          ...cafe,
          location,
          employees: employees.count,
        };
      })
    );

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Cafes" },
        }),
        data: {
          cafes: newCafes.sort((a, b) => (a.employees < b.employees ? 1 : -1)),
        },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({ msgKey: labelKeys.serverError, error }),
      })
    );
  }
});

router.post("/", uploadLocal, async (req, res) => {
  const data = req.body;

  try {
    const cafe = await db(CAFES_TABLE)
      .where("phone_number", data.phone_number)
      .first();
    if (cafe) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.alreadyExists,
            fields: { field: "Phone Number" },
          }),
        })
      );
    }
    const result = await db(CAFES_TABLE).insert({
      ...data,
      logoUrl: req.filePath || "",
      updated_at: db.fn.now(),
    });
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "Cafe" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addError,
          fields: { field: "Cafe" },
        }),
        error,
      })
    );
  }
});

router.get("/:cafeId", async (req, res) => {
  const cafeId = req.params.cafeId;

  try {
    const cafe = await db(CAFES_TABLE).where("id", cafeId).first();
    if (!cafe) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Cafe" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Cafe" },
        }),
        data: { cafe },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "Cafe" },
        }),
        error,
      })
    );
  }
});

router.put("/:cafeId", uploadLocal, async (req, res) => {
  const cafeId = req.params.cafeId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const cafe = await db(CAFES_TABLE).where("id", cafeId).first();

    if (!cafe) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Cafe" },
          }),
        })
      );
    }

    const result = await db(CAFES_TABLE)
      .update({
        ...data,
        logoUrl: req.filePath || "",
        updated_at: db.fn.now(),
      })
      .where("id", cafeId);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "Cafe" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "Cafe" },
        }),
        error,
      })
    );
  }
});

router.delete("/:cafeId", async (req, res) => {
  const cafeId = req.params.cafeId;
  // console.log("addCafe called");

  try {
    const cafe = await db(CAFES_TABLE).where("id", cafeId).first();
    if (!cafe) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Cafe" },
          }),
        })
      );
    }
    const result1 = await db(EMPLOYEES_TABLE).where("cafe", cafeId).del();
    const result2 = await db(CAFES_TABLE).where("id", cafeId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "Cafe" },
        }),
        data: { result1, result2 },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "Cafe" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
