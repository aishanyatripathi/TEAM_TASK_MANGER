const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, allowRoles("admin"), async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;
    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ message: "title, projectId, assignedTo are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });

    const populated = await task.populate("project assignedTo createdBy", "name email role");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only assignee or admin can update this task" });
    }

    task.status = status;
    await task.save();
    const populated = await task.populate("project assignedTo createdBy", "name email role");
    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
