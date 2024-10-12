const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AdminAuth");
const { SubjectModel, validateSubject } = require("../models/Subject-model");

// admin controller part

router.get('/create-subject',auth,(req,res)=>{
  res.render('create-subject',{layout:false});
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
    res.status(201).json(subject);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/get-subjects", auth, async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.status(200).json(subjects);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get('/update/:id',auth,async(req,res)=>{
  try {
    const subject = await SubjectModel.findById(req.params.id);
    res.render('update-subject',{layout:false,subject,
      
    });
    
  } catch (error) {
    console.log(error);

    res.redirect("/api/admin/dashboard")
    
  }
})

router.put("/update/:id", auth, async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(subject);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});



module.exports = router;
