const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateLogin } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  // 1. Validate the payload.
  const { error } = validateLogin(req.body);

  if (error) {
    res.send(error.details[0].message);
    return;
  }

  const { email, password } = req.body;

  // 2. User exists or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  // 3. Valid password or not
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  const token = user.generateToken();

  res.send(token); // jwt token
});

module.exports = router;
