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
const upload = multer({ storage: storage }).single("logoUrl");

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
    const file = req.file;
    const array_of_allowed_files = ["png", "jpeg", "jpg", "gif"];
    const array_of_allowed_file_types = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
    ];
    const allowed_file_size = 4;
    if (!file) {
      next();
    } else {
      const filename = path.basename(file.path);
      console.log(filename, "filename");
      const file_extension = file.originalname.slice(
        file.originalname.lastIndexOf(".") + 1
      );

      console.log(file_extension, "file_extension");
      console.log(file.mimetype, "file.memetype");

      // Check if the uploaded file is allowed
      if (
        !array_of_allowed_files.includes(file_extension) ||
        !array_of_allowed_file_types.includes(file.mimetype)
      ) {
        return res.status(500).send(
          errorResponse({
            message: getI18nMessage({
              msgKey: labelKeys.invalidFile,
              fields: { field: array_of_allowed_files.join(", ") },
            }),
            error: { file },
          })
        );
      }

      if (file.size / (1024 * 1024) > allowed_file_size) {
        return res.status(500).send(
          errorResponse({
            message: getI18nMessage({
              msgKey: labelKeys.fileTooLarge,
              fields: { field: allowed_file_size + "MB" },
            }),
            error: { file },
          })
        );
      }
      const protocol = req.secure ? "https://" : "http://";
      const filePath = `${protocol}${host}:${port}/public/images/${file.filename}`;
      req.filePath = filePath;
      return next();
    }
  });
};

module.exports = uploadLocal;
