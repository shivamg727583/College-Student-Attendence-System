const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AdminAuth");
const { SubjectModel, validateSubject } = require("../models/Subject-model");
const {TeacherModel } = require('../models/Teacher-model')
const {ClassModel} = require('../models/Class-model')

// admin controller part

router.get('/create-subject',auth,(req,res)=>{
  res.render('create-subject',{
    successMessage: req.flash('success'), // If using connect-flash for messages
    errorMessages: req.flash('error')      // If using connect-flash for messages
  });
})


router.post("/create-subject", auth, async (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;
    const { error } = validateSubject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let subject = await SubjectModel.findOne({ subject_code });
    if (subject) return res.status(400).send("Subject already exists");

    subject = await SubjectModel.create({
      subject_name,
      subject_code,
    });
    req.flash("success","Subject Created.")
    res.redirect('/api/admin/dashboard');
    // res.status(201).json(subject);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});



router.get('/update/:id',auth,async(req,res)=>{
  try {
    const subject = await SubjectModel.findById(req.params.id);
    res.render('update-subject',{
      subject,
      successMessage: req.flash('success'), // If using connect-flash for messages
      errorMessages: req.flash('error')      // If using connect-flash for messages
      
   });  
  } catch (error) {
    console.log(error);
    req.flash("error","Error in updation")
    res.redirect(`/api/admin/manage-subjects`);
    
  }
})

router.post("/update/:id", auth, async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    req.flash("success","Subject Updated successfully");
    res.redirect(`/api/admin/manage-subjects`);
   
  } catch (err) {
    console.log(err);
    req.flash("error","Error in subject updation");
    res.redirect(`/api/admin/manage-subjects`);

  }
});


router.get('/delete/:id', auth, async (req, res) => {
  const subjectId = req.params.id;

  try {
      // Delete the subject from the SubjectModel
      const deletedSubject = await SubjectModel.findByIdAndDelete(subjectId);

      if (!deletedSubject) {
          req.flash("error", "Subject not found.");
          return res.redirect('/api/admin/manage-subjects');
      }

      // Remove the subject from all classes in ClassModel
      await ClassModel.updateMany(
          { 'subjects.subject': subjectId }, // Find all classes with this subject
          { $pull: { subjects: { subject: subjectId } } } // Remove the subject from the array
      );

      // Optionally, if teachers have subjects stored in a separate field, you can remove the subject from teachers as well.
      // For example:
      await TeacherModel.updateMany(
          { 'subjects': subjectId }, // If teachers store subject IDs in their schema
          { $pull: { subjects: subjectId } } // Remove the subject from the teacher's list of subjects
      );

      req.flash("success", "Subject deleted successfully and removed from all associated classes and teachers.");
      res.redirect('/api/admin/manage-subjects');

  } catch (error) {
      console.error("Error deleting subject:", error);
      req.flash("error", "Error in deletion.");
      res.redirect('/api/admin/manage-subjects');
  }
});



module.exports = router;
