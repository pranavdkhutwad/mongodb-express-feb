const express = require("express");
const home = require("./routes/home");
const todos = require("./routes/todos");
const users = require("./routes/users");
const login = require("./routes/login");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/", home);
app.use("/api/todos", todos);
app.use("/api/users", users);
app.use("/api/login", login);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
