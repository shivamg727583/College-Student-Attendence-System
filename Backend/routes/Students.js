
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ClassModel } = require('../models/Class-model');
const { StudentModel, validateStudent } = require('../models/Student-model'); // Adjust path as needed
const auth = require('../middlewares/AdminAuth');
const {RegisterStudents} = require('../controllers/StudentControllers')
const upload = require('../middlewares/upload'); // Path to your Multer config


// GET Route to Render the Registration Page
router.get('/register',auth, (req, res) => {
    res.render('student-register', { 
        success: req.flash('success'), // Using connect-flash for flash messages
        error: req.flash('error')
    });
});

router.post('/register-upload', auth,upload.single('file'),RegisterStudents)

router.get("/delete/:id", auth, async (req, res) => {
    const studentId = req.params.id;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
  
    try {
      // Find the student
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }
  
      // Remove the student
      await StudentModel.findByIdAndDelete(studentId);
  
      // Remove the student from the Class's students array
      await ClassModel.findByIdAndUpdate(
        student.class,
        { $pull: { students: studentId } },
      
      );
  req.flash("success",'delete successfully');
  res.redirect('/api/admin/manage-students')
      // res.status(200).json({ message: "Student deleted successfully." });
    } catch (err) {
   
      console.error("Error deleting student:", err);
      res
        .status(500)
        .json({
          message: "Server error while deleting student.",
          error: err.message,
        });
    }
  });
  

router.get('/edit/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await StudentModel.findById(studentId); // Fetch the student by ID

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render('update-student', { student }); // Render the edit form with the student's data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST route to handle the form submission
router.post('/edit/:id', async (req, res) => {
  try {
      const studentId = req.params.id;
      const updatedData = req.body; // Get the updated data from the form

      // Find the existing student record
      const existingStudent = await StudentModel.findById(studentId);
      if (!existingStudent) {
          return res.status(404).send('Student not found');
      }

      // Check if class_name, section, or semester has changed
      const classChanged = 
          existingStudent.class_name !== updatedData.class_name ||
          existingStudent.section !== updatedData.section ||
          existingStudent.semester !== parseInt(updatedData.semester, 10); // Ensure to parse semester as an integer

      // Update the student in the database
      const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, updatedData, { new: true });

      if (!updatedStudent) {
          return res.status(404).send('Student not found');
      }

      if (classChanged) {
          // If the class has changed, update the class model accordingly

          // Create a key to identify the current class
          const oldClassKey = `${existingStudent.class_name}|${existingStudent.section}|${existingStudent.semester}`;
          const newClassKey = `${updatedData.class_name}|${updatedData.section}|${updatedData.semester}`;

          // Remove the student from the old class
          await ClassModel.updateOne(
              { class_name: existingStudent.class_name, section: existingStudent.section, semester: existingStudent.semester },
              { $pull: { students: studentId } } // Remove student ID from old class
          );

          // Add the student to the new class
          await ClassModel.updateOne(
              { class_name: updatedData.class_name, section: updatedData.section, semester: updatedData.semester },
              { $addToSet: { students: studentId } } // Add student ID to new class
          );

          console.log(`Student ${studentId} moved from class ${oldClassKey} to ${newClassKey}`);
      }

      req.flash("success", "Updated successfully");
      res.redirect('/api/admin/manage-students'); // Redirect to the students list page or wherever you want
  } catch (error) {
      console.error(error);
      req.flash("error", "Server error");
      res.status(500).send('Server error');
  }
});

module.exports = router;


