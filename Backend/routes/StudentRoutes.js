const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { StudentModel, validateStudent } = require("../models/Student-model"); // Adjust the path as necessary
const auth = require("../middlewares/AdminAuth");
const { ClassModel } = require("../models/Class-model");

router.post("/register-student", auth, async (req, res) => {
  // Validate the request body
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const {
    name,
    email,
    enrollment_number,
    class_name,
    section,
    semester,
    attendance,
  } = req.body;

  try {
    // Check for existing email or enrollment number
    const existingStudent = await StudentModel.findOne({
      $or: [{ email: email }, { enrollment_number: enrollment_number }],
    });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          message:
            "Student with given email or enrollment number already exists.",
        });
    }

    // Find the Class document based on class_name, section, and semester
    let classDoc = await ClassModel.findOne({
      class_name: class_name,
      section: section,
      semester: semester,
    });

    // If Class doesn't exist, create it
    if (!classDoc) {
      return res.status(400).send("Class does not exists");
    }

    // Create the Student document
    const student = new StudentModel({
      name,
      email,
      enrollment_number,
      class: classDoc._id,
      attendance, // Optional, based on your existing schema
    });

    const savedStudent = await student.save();

    classDoc.students.push(savedStudent._id);
    await classDoc.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error("Error registering student:", err);
    res
      .status(500)
      .json({
        message: "Server error while registering student.",
        error: err.message,
      });
  }
});

// Update an existing student (Update)
router.put("/update/:id", auth, async (req, res) => {
  const studentId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID." });
  }

  // Validate the request body
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const {
    name,
    email,
    enrollment_number,
    class_name,
    section,
    semester,
    attendance,
  } = req.body;
  try {
    // Find the student
    const student = await StudentModel.findById(studentId);
    if (!student) {
      req.flash("error", "Student not found");

      return res.status(404).json({ message: "Student not found." });
    }

    // Check for existing email or enrollment number (excluding current student)
    const existingStudent = await StudentModel.findOne({
      $or: [{ email: email }, { enrollment_number: enrollment_number }],
      _id: { $ne: studentId },
    });
    if (existingStudent) {
      req.flash("error", "Student already exist");

      return res
        .status(400)
        .json({
          message:
            "Another student with given email or enrollment number already exists.",
        });
    }

    // Find the new Class document based on class_name, section, and semester
    let newClassDoc = await ClassModel.findOne({
      class_name: class_name,
      section: section,
      semester: semester,
    });
    // If Class doesn't exist, create it
    if (!newClassDoc) {
      req.flash("error", "Class does not exists");

      return res.status(400).send("Class does not exists");
    }

    // If the class is changing, update the old and new Classes
    if (!student.class.equals(newClassDoc._id)) {
      // Remove student from old Class
      await ClassModel.findByIdAndUpdate(student.class, {
        $pull: { students: studentId },
      });

      // Add student to new Class
      newClassDoc.students.push(studentId);
      await newClassDoc.save();

      // Update student's class reference
      student.class = newClassDoc._id;
    }

    // Update other student fields
    student.name = name;
    student.email = email;
    student.enrollment_number = enrollment_number;
    if (attendance) {
      student.attendance = attendance;
    }

    const updatedStudent = await student.save();
    req.flash("success", "updation successfull");
    res.status(200).json(updatedStudent);
  } catch (err) {
    req.flash("error", "Error updating student:");
    console.error("Error updating student:", err);
    res
      .status(500)
      .json({
        message: "Server error while updating student.",
        error: err.message,
      });
  }
});

// Delete a student (Delete)

module.exports = router;
