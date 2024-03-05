const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);

  return token;
};

const User = mongoose.model("User", userSchema);

function validate(payload) {
  const config = Joi.object({
    name: Joi.string().alphanum().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
  });

  return config.validate(payload);
}

function validateLogin(payload) {
  const config = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
  });

  return config.validate(payload);
}

module.exports = {
  User,
  validate,
  validateLogin,
};
