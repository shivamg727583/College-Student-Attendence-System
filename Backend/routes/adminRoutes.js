const express = require("express");
const { AdminModel, validateAdmin } = require("../models/Admin-model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginLimiter = require("../utils/LoginLimit");
const auth = require("../middlewares/AdminAuth");

const adminManageRoutes = require('./adminManageRoutes');

// Create Admin
router.post("/register", async (req, res) => {
  // Validate request body
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check if admin with the given email already exists
    const existingAdmin = await AdminModel.findOne({ email: req.body.email });
    if (existingAdmin)
      return res.status(400).send("Admin with this email already exists.");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the admin instance
    const admin = new AdminModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the admin instance to the database
    await admin.save();
    res.status(201).send({ message: "Admin created successfully" });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).send("Internal Server Error");
  }
});

router.get('/login',(req,res)=>{
  res.render('AdminLogin',{
    successMessage: req.flash('success'), // If using connect-flash for messages
    errorMessages: req.flash('error')      // If using connect-flash for messages
  })
})

// Login Admin
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    // Find admin by email
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).send("Invalid email or password");

    // Compare provided password with stored hashed password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Set the token in an HttpOnly cookie
    res.cookie("Admintoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    req.flash("success","Admin Login Successfully")
   res.redirect('/api/admin/dashboard')
    // res.status(200).send({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Internal Server Error");
  }
});

// Protected Route Example
router.get("/dashboard", auth, async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.admin._id);
    res.render('AdminDashboard', { 
      user:admin ,
      successMessage: req.flash('success'), // If using connect-flash for messages
      errorMessages: req.flash('error')      // If using connect-flash for messages
    });

    // res.status(200).send(req.admin);
  } catch (err) {
    console.error(err);
    req.flash("error","Failed to login admin")
    res.status(500).send("Internal Server Error");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("Admintoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  req.flash("success","Logout successfully");
  res.redirect("/api/admin/login");
  // res.status(200).send({ message: "Logged out successfully" });
});


// Update Admin
router.put("/edit/:id", auth, async (req, res) => {
  const admin = await AdminModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!admin) return res.status(404).send("Admin not found");
  res.send(admin);
});

// Delete Admin
router.delete("/delete/:id", auth, async (req, res) => {
  const admin = await AdminModel.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).send("Admin not found");
  res.send(admin);
});

// manage all functionality of admin
router.use('/',auth,adminManageRoutes)

module.exports = router;
