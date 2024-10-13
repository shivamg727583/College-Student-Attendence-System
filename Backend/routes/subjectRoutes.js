const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AdminAuth");
const { SubjectModel, validateSubject } = require("../models/Subject-model");

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


router.get('/delete/:id',auth,async(req,res)=>{
   try {
    const subjects  = await  SubjectModel.findByIdAndDelete(req.params.id);
    req.flash("success","Subject Deleted");
    res.redirect('/api/admin/manage-subjects');
    
   } catch (error) {
    console.log(error);
    req.flash("error","Error in deletion");
    res.redirect('/api/admin/manage-subjects');
    
   }
})


module.exports = router;
