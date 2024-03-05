const express = require("express");
const { Todo, validate } = require("../models/todo");
const _ = require("lodash");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  try {
    const list = await Todo.find();
    res.send(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);

    res.send(todo);
  } catch (error) {
    res.status(404).send("The given id does not found");
  }
});

router.post("/", auth, async (req, res) => {
  // 1. Validate the payload.
  const { error } = validate(req.body);

  if (error) {
    res.send(error.details[0].message);
    return;
  }

  const { name, desc, priority } = req.body;

  // 2. Read mongoose model and save data.
  try {
    const todo = new Todo({
      name,
      desc,
      priority,
    });

    const response = await todo.save();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;

  // 1. Validate the payload.
  const { error } = validate(req.body);

  if (error) {
    res.send(error.details[0].message);
    return;
  }

  try {
    const todo = await Todo.findById(id);

    todo.set({
      ...req.body,
    });

    const response = await todo.save();

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Todo.deleteOne({ _id: id });

    res.send(`Delete the ${id} item from database`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
