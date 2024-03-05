const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  // 1. Validate the payload.
  const { error } = validate(req.body);

  if (error) {
    res.send(error.details[0].message);
    return;
  }

  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      res.status(400).send("User already exist with this email");
      return;
    }

    // 2. Read mongoose model and save data.
    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const response = await user.save();
    res.send({ name: response.name, email: response.email });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
