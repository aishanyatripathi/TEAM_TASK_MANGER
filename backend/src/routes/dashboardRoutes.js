const express = require("express");
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  try {
    const tasks = await Task.find().lean();
    const now = new Date();
    const summary = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
      ).length,
    };
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
