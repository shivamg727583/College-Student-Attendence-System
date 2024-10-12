const express = require('express')
const router = express.Router();
const auth = require('../middlewares/AdminAuth');
const {ClassModel,validateClass }= require('../models/Class-model');
const {SubjectModel} = require('../models/Subject-model');
const {TeacherModel} = require('../models/Teacher-model');
const {StudentModel }= require('../models/Student-model');


///      admin controller part 

router.post('/create-class', auth, async (req, res) => {
    const { class_name, section, semester, subjects, students } = req.body;
    try {
        // Validate Subjects and (optionally) Teachers

          // Check if 'subjects' is an array of strings
          if (subjects.length > 0 && typeof subjects[0] === 'string') {
            // Transform it into array of objects with 'subject' field
            subjects = subjects.map(subId => ({ subject: subId }));
        }
        console.log(subjects)
        for (let i = 0; i < subjects.length; i++) {
            const { subject, teacher } = subjects[i];

            console.log(subject)
            // Check if Subject exists
            const subjectExists = await SubjectModel.findById(subject);
            if (!subjectExists) {
                return res.status(400).send(`Subject with ID ${subject} does not exist.`);
            }

            // If a teacher is provided, validate the teacher
            if (teacher) {
                const teacherExists = await TeacherModel.findById(teacher);
                if (!teacherExists) {
                    return res.status(400).send(`Teacher with ID ${teacher} does not exist.`);
                }

                // Optional: Verify that the Teacher is assigned to the Subject
                if (!teacherExists.subjects.includes(subject)) {
                    return res.status(400).send(`Teacher with ID ${teacher} is not assigned to Subject with ID ${subject}.`);
                }
            }
        }

        
        // Create new Class
        const classObj = new ClassModel({
            class_name,
            semester,
            section,
            subjects,
            students: students || []
        });

        await classObj.save();

        res.status(201).send(classObj);
    } catch (err) {
        console.error('Error creating class:', err);
        res.status(500).send('Internal Server Error');
    }
});


router.delete('/classes/:id', auth, async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).send({ message: 'Invalid Class ID.' });
    }

    try {
        const deletedClass = await ClassModel.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).send({ message: 'Class not found.' });
        }

        res.status(200).send({ message: 'Class deleted successfully.', class: deletedClass });
    } catch (err) {
        console.error('Error deleting class:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});






module.exports = router