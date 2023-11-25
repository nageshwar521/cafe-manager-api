const express = require("express");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const labelKeys = require("../i18n/labelKeys");
const { POSTS_TABLE } = require("../constants");
const { isEmpty } = require("lodash");
const uploadLocal = require("../middlewares/uploadLocal");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let posts = await db(POSTS_TABLE).select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Posts" },
        }),
        data: {
          posts,
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

router.post("/", verifyToken, uploadLocal, async (req, res) => {
  const data = req.body;

  try {
    const result = await db(POSTS_TABLE).insert({
      ...data,
      photos: (req.images || []).join(", "),
      videos: (req.videos || []).join(", "),
      updated_at: db.fn.now(),
    });
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addSuccess,
          fields: { field: "Post" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.addError,
          fields: { field: "Post" },
        }),
        error,
      })
    );
  }
});

router.get("/:postId", verifyToken, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await db(POSTS_TABLE).where("id", postId).first();
    if (!post) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Post" },
          }),
        })
      );
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getSuccess,
          fields: { field: "Post" },
        }),
        data: { post },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.getError,
          fields: { field: "Post" },
        }),
        error,
      })
    );
  }
});

router.put("/:postId", verifyToken, uploadLocal, async (req, res) => {
  const postId = req.params.postId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const post = await db(POSTS_TABLE).where("id", postId).first();

    if (!post) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Post" },
          }),
        })
      );
    }

    const result = await db(POSTS_TABLE)
      .update({
        ...data,
        logoUrl: req.filePath || "",
        updated_at: db.fn.now(),
      })
      .where("id", postId);
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateSuccess,
          fields: { field: "Post" },
        }),
        data: { result },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.updateError,
          fields: { field: "Post" },
        }),
        error,
      })
    );
  }
});

router.delete("/:postId", verifyToken, async (req, res) => {
  const postId = req.params.postId;
  // console.log("addPost called");

  try {
    const post = await db(POSTS_TABLE).where("id", postId).first();
    if (!post) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fieldNotFound,
            fields: { field: "Post" },
          }),
        })
      );
    }
    const result1 = await db(EMPLOYEES_TABLE).where("post", postId).del();
    const result2 = await db(POSTS_TABLE).where("id", postId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteSuccess,
          fields: { field: "Post" },
        }),
        data: { result1, result2 },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage({
          msgKey: labelKeys.deleteError,
          fields: { field: "Post" },
        }),
        error,
      })
    );
  }
});

module.exports = router;
