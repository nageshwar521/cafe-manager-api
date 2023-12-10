require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const cafeRoutes = require("./src/routes/cafes");
const employeeRoutes = require("./src/routes/employees");
const userRoutes = require("./src/routes/users");
const roleRoutes = require("./src/routes/roles");
const locationRoutes = require("./src/routes/locations");
const amenitiesRoutes = require("./src/routes/amenities");
const categoriesRoutes = require("./src/routes/categories");
const conditionsRoutes = require("./src/routes/conditions");
const postsRoutes = require("./src/routes/posts");
const verifyToken = require("./src/middlewares/verifyToken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/test", (req, res) => {
  res.send("Api is working");
});
app.use("/public/images/:imageName", (req, res) => {
  console.log(req.params.imageName, "req.params.imageName");
  return res.sendFile(path.join(__dirname, `/uploads/${req.params.imageName}`));
});
app.use("/api/auth", authRoutes);
// app.use("/api/cafes", verifyToken, cafeRoutes);
app.use("/api/employees", verifyToken, employeeRoutes);
// app.use("/api/roles", verifyToken, roleRoutes);
// app.use("/api/locations", verifyToken, locationRoutes);
app.use("/api/amenities", verifyToken, amenitiesRoutes);
app.use("/api/categories", verifyToken, categoriesRoutes);
app.use("/api/conditions", verifyToken, conditionsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", verifyToken, userRoutes);

const port = process.env.NODE_SERVER_PORT;
const host = process.env.NODE_SERVER_HOST;

app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
