require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const cors = require("cors");
const cafeRoutes = require("./routes/cafes");
const employeeRoutes = require("./routes/employees");
const roleRoutes = require("./routes/roles");
const locationRoutes = require("./routes/locations");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/test", (req, res) => {
  res.send("Api is working");
});
app.use("/public/images/:imageName", (req, res) => {
  console.log(req.params.imageName, "req.params.imageName");
  return res.sendFile(path.join(__dirname, `/uploads/${req.params.imageName}`));
});
app.use("/api/cafes", cafeRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/locations", locationRoutes);

const port = process.env.NODE_SERVER_PORT;
const host = process.env.NODE_SERVER_HOST;

app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
