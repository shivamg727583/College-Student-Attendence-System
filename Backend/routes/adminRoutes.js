const express = require("express");
const { AdminModel, validateAdmin } = require("../models/Admin-model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginLimiter = require("../utils/LoginLimit");
const auth = require("../middlewares/AdminAuth");

const adminManageRoutes = require('./adminManageRoutes');
const { TeacherModel } = require("../models/Teacher-model");
const { StudentModel } = require("../models/Student-model");
const { ClassModel } = require("../models/Class-model");
const { SubjectModel } = require("../models/Subject-model");

// Create Admin
router.post("/register", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const existingAdmin = await AdminModel.findOne({ email: req.body.email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin with this email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new AdminModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Admin
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.cookie("Admintoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Logged in successfully" , token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected Route Example (Dashboard)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const teachers = await TeacherModel.find({});
    const students = await StudentModel.find({});
    const classes = await ClassModel.find({});
    const subjects = await SubjectModel.find({});
    const admin = await AdminModel.findById(req.admin._id);

    console.log('enter in dashboard')

    res.status(200).json({ 
      admin: admin,
      teachers, 
      students, 
      classes, 
      subjects 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("Admintoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Update Admin
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Admin
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// manage all functionality of admin
router.use('/', auth, adminManageRoutes);

module.exports = router;
