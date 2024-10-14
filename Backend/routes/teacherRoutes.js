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
router.get('/register-teacher',auth, async(req,res)=>{
  try {
    const subjects = await SubjectModel.find({}).exec();
    const classes = await ClassModel.find({}).exec();
    res.render('teacher-register', {
        user: req.teacher, // If using authentication
        subjects,
        classes,
        oldInput: req.body // To retain input on validation errors
    });
} catch (error) {
    console.error('Error fetching subjects and classes:', error);
    res.status(500).send('Server Error');
}
  

})

// create teacher
router.post("/register-teacher", auth, async (req, res) => {
 
  const { error } = validateTeacher(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, subjects, classes } = req.body;
  

  try {
    // Check for existing email
    const existingTeacher = await TeacherModel.findOne({ email: email });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: "Teacher with given email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the Teacher document
    const teacher = new TeacherModel({
      name,
      email,
      password: hashedPassword,
      subjects ,
      classes ,
    });

    const savedTeacher = await teacher.save();

    const teacherResponse = savedTeacher.toObject();
    delete teacherResponse.password;
    // res.status(201).json(teacherResponse);
console.log("teacher register")
    res.redirect('/api/teachers/register-teacher')
  } catch (err) {
    console.error("Error registering teacher:", err);
    res
      .status(500)
      .json({
        message: "Server error while registering teacher.",
        error: err.message,
      });
  }
});

router.get('/manage-teachers', auth, async (req, res) => {
  try {
      // Fetch all teachers, populate subjects and classes if they are references
      const teachers = await TeacherModel.find({})
          .populate('subjects') // Assuming 'subjects' is an array of ObjectId references
          .populate('classes')  // Assuming 'classes' is an array of ObjectId references
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
//   if (req.user._id.toString() === teacherId) {
//     req.flash('error', 'You cannot delete your own account.');
//     return res.redirect('/manage-teachers');
// }


  try {
      const teacher = await TeacherModel.findById(req.params.id).exec();
      if (!teacher) {
          req.flash('error', 'Teacher not found.');
          return res.redirect('/api/teachers/login');
      }

      const subjects = await SubjectModel.find({}).exec();
      const classes = await ClassModel.find({}).exec();

      res.render('update-teacher', {
          user:teacher, // If using authentication
          teacher,
          subjects,
          classes,
          oldInput: teacher, 
          successMessage: req.flash('success'), // If using connect-flash for messages
          errorMessages: req.flash('error')    
      });
  } catch (error) {
      console.error('Error fetching teacher data:', error);
      req.flash('error', 'Server Error. Please try again later.');
      res.redirect('/api/teachers/dashboard'); // Redirect to a relevant page
  }
});

// Update Teacher
router.post("/update/:id", auth ,async (req, res) => {
  const teacher = await TeacherModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!teacher) return res.status(404).send("Teacher not found");
  // res.send(teacher);
  res.redirect('/api/admin/dashboard');
});

// router.post('/update', TeacherAuth, async (req, res) => {
//   const { teacherId, name, email, password, subjects, classes } = req.body;
//   const errorMessages = []; // Initialize errorMessages array

//   try {
//       // Fetch the teacher by ID
//       const teacher = await TeacherModel.findById(teacherId).exec();
//       if (!teacher) {
//           req.flash('error', 'Teacher not found.');
//           return res.redirect('/login');
//       }

//       // **1. Update Name (Optional)**
//       if (name && name.trim() !== '' && name !== teacher.name) {
//           teacher.name = name.trim();
//       }

//       // **2. Update Email (Optional)**
//       if (email && email.trim() !== '' && email !== teacher.email) {
//           // Check if the new email is already in use
//           const existingTeacher = await TeacherModel.findOne({ email: email.trim() }).exec();
//           if (existingTeacher && existingTeacher._id.toString() !== teacherId) {
//               errorMessages.push('Email is already in use by another account.');
//           } else {
//               teacher.email = email.trim();
//           }
//       }

//       // **3. Update Subjects (Optional)**
//       if (subjects && Array.isArray(subjects) && subjects.length > 0) {
//           // Optionally, validate subject IDs here
//           teacher.subjects = subjects;
//       }

//       // **4. Update Classes (Optional)**
//       if (classes && Array.isArray(classes) && classes.length > 0) {
//           // Optionally, validate class IDs here
//           teacher.classes = classes;
//       }

//       // **5. Update Password (Optional)**
//       if (password && password.trim() !== '') {
//           // Optionally, add password strength validation here
//           const hashedPassword = await bcrypt.hash(password.trim(), 10);
//           teacher.password = hashedPassword;
//       }

//       // **6. Handle Validation Errors**
//       if (errorMessages.length > 0) {
//           req.flash('error', errorMessages);
//           return res.redirect('/teachers/update');
//       }

//       // **7. Save Updated Teacher**
//       await teacher.save();

//       // **8. Success Message and Redirection**
//       req.flash('success', 'Profile updated successfully.');
//       res.redirect('/api/teachers/update');
//   } catch (error) {
//       console.error('Error updating teacher profile:', error);
//       errorMessages.push('Server Error. Please try again later.');
//       req.flash('error', errorMessages);
//       res.redirect('/api/teachers/update');
//   }
// });



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
