const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TeacherModel, validateTeacher } = require("../models/Teacher-model");
const { SubjectModel } = require("../models/Subject-model");
const { ClassModel } = require("../models/Class-model");
const { StudentModel } = require("../models/Student-model");
const attendanceRoute = require("./attendenceRoutes");

const auth = require("../middlewares/AdminAuth");
const TeacherAuth = require("../middlewares/TeacherAuth");

// 🟢 Register a new teacher (Admin Protected)
router.post("/register-teacher", auth, async (req, res) => {
  try {
    const { error } = validateTeacher(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, teachingSchedule } = req.body;

    // Check if teacher already exists
    const existingTeacher = await TeacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher with this email already exists." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Format teaching schedule with class IDs
    const scheduleWithClassId = await Promise.all(
      teachingSchedule.map(async (schedule) => {
        const classObj = await ClassModel.findOne({
          class_name: schedule.class_name,
          section: schedule.section,
          semester: schedule.semester,
        });

        if (!classObj) {
          throw new Error(`Class ${schedule.class_name}, section ${schedule.section}, semester ${schedule.semester} not found.`);
        }

        return { ...schedule, classId: classObj._id };
      })
    );

    // Create teacher
    const teacher = new TeacherModel({
      name,
      email,
      password: hashedPassword,
      teachingSchedule: scheduleWithClassId,
    });

    await teacher.save();
    res.status(201).json({ message: "Teacher registered successfully", teacher });
  } catch (err) {
    console.error("Error registering teacher:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🟢 Fetch all teachers (Admin Protected)
router.get("/manage-teachers", auth, async (req, res) => {
  try {
    const teachers = await TeacherModel.find().populate("teachingSchedule.subjectId");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve teachers", error: error.message });
  }
});


// Fetch a techer by id
router.get('/fetch-teacher/:id',auth,async(req,res)=>{
  try{
    const teacher = await TeacherModel.findById(req.params.id).populate('teachingSchedule.subjectId');
    if(!teacher) return res.status(404).json({message:"Teacher not found"});
    res.status(200).json(teacher);
  }catch(error){
    res.status(500).json({message:"Failed to fetch teacher",error:error.message});
  }

})
// 🟢 Delete a teacher (Admin Protected)
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const deletedTeacher = await TeacherModel.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error: error.message });
  }
});

// 🟢 Admin can edit a teacher's details
router.put("/edit-teacher/:id", auth, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updates = req.body;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    console.log("updates",updates)
    
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      teacherId,
      updates,
      { new: true }
    );
    
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log("updatedTeacher",updatedTeacher)
    res.status(200).json({ message: "Teacher updated successfully", updatedTeacher });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to update teacher", error: error.message });
  }
});

// 🟢 Teacher can update their own profile
router.put("/edit-profile", TeacherAuth, async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const updates = req.body;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      teacherId,
      updates,
      { new: true }
    );
    
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.status(200).json({ message: "Profile updated successfully", updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});


// 🟢 Teacher Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await TeacherModel.findOne({ email });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isValidPassword = await bcrypt.compare(password, teacher.password);
    if (!isValidPassword) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ _id: teacher._id, email: teacher.email }, process.env.SECRET_KEY);

    res.cookie("Teachertoken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 3600000 });

    res.status(200).json({ message: "Login successful", token, teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🟢 Teacher Dashboard (Protected)
router.get("/dashboard", TeacherAuth, async (req, res) => {
  try {
    const teacher = await TeacherModel.findById(req.teacher._id).select("-password");
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🟢 Logout Teacher
router.get("/logout", (req, res) => {
  res.clearCookie("Teachertoken");
  res.status(200).json({ message: "Logged out successfully" });
});

// Use Attendance Routes
router.use("/", attendanceRoute);

module.exports = router;
