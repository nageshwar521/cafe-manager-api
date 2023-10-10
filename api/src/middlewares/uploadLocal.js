const path = require("path");
const { getI18nMessage } = require("../i18n");
const { errorResponse, successResponse } = require("../utils");
const port = process.env.NODE_SERVER_PORT;
const host = process.env.NODE_SERVER_HOST;

const multer = require("multer");
const labelKeys = require("../i18n/labelKeys");

const uploadsPath = path.join(__dirname, "../uploads");

console.log(uploadsPath, "uploadsPath");

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage: storage }).array("images", 10);

const uploadLocal = (req, res, next) => {
  return upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fileUploadError,
          }),
          err,
        })
      );
    } else if (err) {
      return res.status(500).send(
        errorResponse({
          message: getI18nMessage({
            msgKey: labelKeys.fileUploadError,
          }),
          err,
        })
      );
    }
    const images = req.images;
    const errors = [];
    const array_of_allowed_images = ["png", "jpeg", "jpg", "gif"];
    const array_of_allowed_image_types = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    const allowed_image_size = 4;
    if (!images) {
      next();
    } else {
      images.forEach((image) => {
        const imagename = path.basename(image.path);
        console.log(imagename, "imagename");
        const image_extension = image.originalname.slice(
          image.originalname.lastIndexOf(".") + 1
        );

        console.log(image_extension, "image_extension");
        console.log(image.mimetype, "image.memetype");

        // Check if the uploaded image is allowed
        if (
          !array_of_allowed_images.includes(image_extension) ||
          !array_of_allowed_image_types.includes(image.mimetype)
        ) {
          errors.push(
            getI18nMessage({
              msgKey: labelKeys.invalidFile,
              fields: { field: array_of_allowed_images.join(", ") },
            })
          );
        }

        if (image.size / (1024 * 1024) > allowed_image_size) {
          return errors.push(
            getI18nMessage({
              msgKey: labelKeys.imageTooLarge,
              fields: { field: allowed_image_size + "MB" },
            })
          );
        }
        const protocol = req.secure ? "https://" : "http://";
        images.push(
          `${protocol}${host}:${port}/public/images/${image.imagename}`
        );
      });
      if (errors.length > 0) {
        return res.status(500).send(
          errorResponse({
            message: getI18nMessage({
              msgKey: labelKeys.fileUploadError,
            }),
            error: {
              errors,
            },
          })
        );
      }
      req.imagePath = imagePath;
      return next();
    }
  });
};

module.exports = uploadLocal;
