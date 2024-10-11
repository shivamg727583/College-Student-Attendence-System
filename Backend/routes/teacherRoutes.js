const express = require('express');
const { TeacherModel, validateTeacher } = require('../models/Teacher-model');
const router = express.Router();
const auth = require('../middlewares/AdminAuth');


////////////////////////  ADMIN HANDLE PART //////////////////////////////////

// create teacher
router.post('/register-teacher', auth, async (req, res) => {
    // Validate Teacher data
    const { error } = validateTeacher(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if Teacher already exists
    let teacher = await TeacherModel.findOne({ email: req.body.email });
    if (teacher) return res.status(400).send('Teacher already registered.');

    // Optional: Verify that the subjects and classes exist
    const subjectsExist = await Subject.find({ _id: { $in: req.body.subjects } });
    if (subjectsExist.length !== req.body.subjects.length) {
        return res.status(400).send('One or more subjects do not exist.');
    }

    const classesExist = await ClassModel.find({ _id: { $in: req.body.classes } });
    if (classesExist.length !== req.body.classes.length) {
        return res.status(400).send('One or more classes do not exist.');
    }

    // Create new Teacher
    teacher = new TeacherModel(req.body);
    await teacher.save();

    res.status(201).send(teacher);
});


// see all teacher
router.get('/all', async (req, res) => {
    const teachers = await TeacherModel.find();
    res.send(teachers);
});


// Delete Teacher
router.delete('/delete/:id', async (req, res) => {
    const teacher = await TeacherModel.findByIdAndRemove(req.params.id);
    if (!teacher) return res.status(404).send('Teacher not found');
    res.send(teacher);
});



/////////////////   TEACHER HANDLE PART /////////////////////

// Update Teacher
router.put('/update/:id', async (req, res) => {
    const { error } = validateTeacher(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const teacher = await TeacherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).send('Teacher not found');
    res.send(teacher);
});

module.exports = router;
