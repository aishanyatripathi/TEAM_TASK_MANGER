const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, allowRoles("admin"), async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const members = await User.find({ _id: { $in: memberIds } }).select("_id");
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: members.map((m) => m._id),
    });
    const populated = await project.populate("createdBy members", "name email role");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
