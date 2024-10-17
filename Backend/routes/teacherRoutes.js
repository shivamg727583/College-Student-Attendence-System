const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TeacherModel, validateTeacher } = require("../models/Teacher-model");
const { SubjectModel } = require("../models/Subject-model");
const { ClassModel } = require("../models/Class-model");
const {StudentModel} = require('../models/Student-model')

const attendanceRoute = require('./attendenceRoutes');

const auth = require("../middlewares/AdminAuth");
const TeacherAuth = require("../middlewares/TeacherAuth");

////////////////////////  ADMIN HANDLE PART //////////////////////////////////
router.get('/register-teacher', auth, async (req, res) => {
  try {
      const subjects = (await SubjectModel.find({}).exec());
      const classes = await ClassModel.find({}).exec();

      // Extract and deduplicate sections and semesters
      const sections = [...new Set(classes.map(cls => cls.section))].sort();
      const semesters = [...new Set(classes.map(cls => cls.semester))].sort();
      const className = [...new Set(classes.map((cls)=>cls.class_name))].sort();

      res.render('teacher-register', {
          user: req.teacher, // Pass the authenticated teacher
          subjects,          // Subjects fetched from the DB
          classes,           // All class data
          sections,          // Unique sections
          semesters,  
          className,       // Unique semesters
          oldInput: req.body, // Retain input in case of validation errors,
          successMessage:req.flash('success'),
          errorMessages:req.flash('error'),
      });
  } catch (error) {
      console.error('Error fetching subjects and classes:', error);
      // It's better to render an error page or flash a message instead of sending raw status
      res.status(500).render('error-page', { message: 'Error fetching data. Please try again later.' });
  }
});


// create teacher
router.post("/register-teacher", auth, async (req, res) => {
  // Validate input data using Joi
  const { error } = validateTeacher(req.body);
  if (error) {
    console.log(error)
    
      return res.status(400).json({ message: error.details[0].message });
  }
  console.log("hyyee")

 
  const { name, email, password, teachingSchedule } = req.body;
 

  // Extracting classes from teachingSchedule
  const classes = teachingSchedule.map(schedule => ({
    class_name: schedule.class_name,
    section: schedule.section,
    semester: schedule.semester,
    subjectId: schedule.subjectId
}));


 

  try {
      // Check for existing email
      const existingTeacher = await TeacherModel.findOne({ email: email });
      if (existingTeacher) {
          return res.status(400).json({ message: "Teacher with given email already exists." });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the Teacher document
      const teacher = new TeacherModel({
          name,
          email,
          password: hashedPassword,
          teachingSchedule:classes    // Array of class objects extracted from teachingSchedule
      });

      // Save the teacher document to the database
      const savedTeacher = await teacher.save();

    req.flash("success","Teacher register successfully");
    res.redirect('/api/teachers/register-teacher')
  } catch (err) {
      console.error("Error registering teacher:", err);
      res.status(500).json({
          message: "Server error while registering teacher.",
          error: err.message,
      });
  }
});
router.get('/manage-teachers', auth, async (req, res) => {
  try {
      // Fetch all teachers, populate subjects and classes if they are references
      const teachers = await TeacherModel.find({}).populate('teachingSchedule.subjectId')
          .exec();


      res.render('manage-teachers', {
          user: req.user, // If using authentication
          teachers,
          successMessage: req.flash('success'), // If using connect-flash for messages
          errorMessages: req.flash('error')      // If using connect-flash for messages
      });
  } catch (error) {
      console.error('Error fetching teachers:', error);
      req.flash('error', 'Failed to retrieve teachers.');
      res.redirect('/api/admin/dashboard'); // Redirect to a relevant page
  }
});



router.get('/delete/:id', auth, async (req, res) => {
  const teacherId = req.params.id;

  try {
      // Find and delete the teacher
      const deletedTeacher = await TeacherModel.findByIdAndDelete(teacherId);

      if (!deletedTeacher) {
          req.flash('error', 'Teacher not found.');
      } else {
          // After deleting the teacher, update all classes to remove the teacher from the subjects array
          await ClassModel.updateMany(
              { 'subjects.teacher': teacherId }, // Find all subjects with this teacher
              { $unset: { 'subjects.$[elem].teacher': "" } }, // Remove teacher from subject
              { arrayFilters: [{ 'elem.teacher': teacherId }] } // Filter subjects in the array
          );

          req.flash('success', 'Teacher deleted successfully and removed from class subjects.');
      }

      res.redirect('/api/teachers/manage-teachers');
  } catch (error) {
      console.error('Error deleting teacher:', error);
      req.flash('error', 'Failed to delete teacher.');
      res.redirect('/api/teachers/manage-teachers');
  }
});



/////////////////   TEACHER HANDLE PART /////////////////////

// GET Route to Render Update Profile Page
router.get('/update/:id', async (req, res) => {

try {
  const teacher = await TeacherModel.findById(req.params.id).exec();
      if (!teacher) {
          req.flash('error', 'Teacher not found.');
          return res.redirect('/api/teachers/login');
      }
  
  const subjects = (await SubjectModel.find({}).exec());
  const classes = await ClassModel.find({}).exec();

  // Extract and deduplicate sections and semesters
  const sections = [...new Set(classes.map(cls => cls.section))].sort();
  const semesters = [...new Set(classes.map(cls => cls.semester))].sort();
  const className = [...new Set(classes.map((cls)=>cls.class_name))].sort();

  res.render('update-teacher', { 
      teacher, 
      subjects, 
      className, 
      sections, 
      semesters,
      user: req.user, 
      successMessage: req.flash('success'), // If using connect-flash for messages
      errorMessages: req.flash('error')    
  });

  } catch (error) {
      console.error('Error fetching teacher data:', error);
      req.flash('error', 'Server Error. Please try again later.');
      res.redirect('/api/teachers/dashboard'); // Redirect to a relevant page
  }
});


router.post('/update-teacher/:id', auth,async (req, res) => {
  try {
      const { name, email, password, teachingSchedule } = req.body;

      // Find the teacher by ID
      const teacher = await TeacherModel.findById(req.params.id);
      if (!teacher) {
          return res.status(404).send('Teacher not found');
      }

      // Update basic information
      teacher.name = name;
      teacher.email = email;

      // Update password if provided
      if (password && password.trim() !== '') {
          const hashedPassword = await bcrypt.hash(password, 10);
          teacher.password = hashedPassword;
      }

      // Update teaching schedule
      teacher.teachingSchedule = teachingSchedule.map(schedule => ({
          subjectId: schedule.subjectId,
          class_name: schedule.class,
          section: schedule.section,
          semester: schedule.semester
      }));

      // Save the updated teacher
      await teacher.save();
req.flash('success','teacher profile updated')
      res.redirect('/api/teachers/manage-teachers'); // Redirect to the teacher's profile or another appropriate page
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating teacher');
     
  }
});



router.get("/login", (req, res) => {
  res.render("TeacherLogin");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const teacher = await TeacherModel.findOne({ email });
  if (!teacher) return res.status(404).send("Teacher not found");
  const isValidPassword = await bcrypt.compare(password, teacher.password);
  if (!isValidPassword) return res.status(400).send("Invalid password");

  const token = jwt.sign({ _id: teacher._id,email:teacher.email }, process.env.SECRET_KEY);
     // Set the token in an HttpOnly cookie
     res.cookie("Teachertoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      });
  
      // Optionally, send a response indicating successful login
    //   res.status(200).send({ message: "Logged in successfully" });
    res.redirect("/api/teachers/dashboard");
});

router.get("/dashboard", TeacherAuth ,(req,res)=>{
console.log(req.teacher)
res.render('TeacherDashboard',{user:req.teacher})
})



router.use('/',attendanceRoute)


router.get('/logout',(req,res)=>{
  res.clearCookie("Teachertoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  // res.status(200).send({ message: "Logged out successfully" });
  res.redirect('/api/teachers/login')
})




module.exports = router;
