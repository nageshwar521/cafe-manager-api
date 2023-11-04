const router = express.Router();

app.get("/*", function (req, res) {
  var file = __dirname + "/upload-folder/dramaticpenguin.MOV";

  var filename = path.basename(file);
  var mimetype = mime.getType(file);

  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});
