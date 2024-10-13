const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const auth = require('../middlewares/AdminAuth');
const {ClassModel,validateClass }= require('../models/Class-model');
const {SubjectModel} = require('../models/Subject-model');
const {TeacherModel} = require('../models/Teacher-model');
const {StudentModel }= require('../models/Student-model');


///      admin controller part 
router.get('/create-class',auth,async(req,res)=>{
    try {
        // Fetch subjects and teachers for dropdowns (optional)
        const subjects = await SubjectModel.find().select('_id subject_name subject_code'); // Adjust fields as per your Subject model
        const teachers = await TeacherModel.find().select('_id name'); // Adjust fields as per your Teacher model
        const students = await StudentModel.find().select('_id name'); // Optional, if you want to select students

        res.render('create-class', { 
            formData: {}, 
            errors: {}, 
            subjects, 
            teachers,
            students,
            successMessage: req.flash('success'), // If using connect-flash for messages
            errorMessages: req.flash('error')      // If using connect-flash for messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

// POST /classes - Handle form submission to create a new class
router.post('/create-class', async (req, res) => {
    // Extract data from form
    const { class_name, section, semester, subjects, students } = req.body;

    console.log(subjects)

    // Prepare data
    let classData = {
        class_name,
        section,
        semester,
        subjects: Array.isArray(subjects) ? subjects : [subjects], // Ensure subjects is an array
        students: students ? students.split(',').map(id => id.trim()) : []
    };

    // Validate data using Joi
    const { error } = validateClass(classData);
    if (error) {
        // Extract error details to send back to the form
        const errors = {};
        error.details.forEach(err => {
            const path = err.path;
            if (path[0] === 'subjects') {
                const index = path[1];
                const field = path[2];
                if (!errors.subjects) errors.subjects = [];
                if (!errors.subjects[index]) errors.subjects[index] = {};
                errors.subjects[index][field] = { message: err.message };
            } else {
                errors[path[0]] = { message: err.message };
            }
        });

        // Re-render the form with existing data and errors
        return res.status(400).render('create-class', { 
            formData: classData, 
            errors, 
            subjects: await SubjectModel.find().select('_id name'),
            teachers: await TeacherModel.find().select('_id name'),
            students: await StudentModel.find().select('_id name')
        });
    }

    try {
        // Create and save the class
        const newClass = new ClassModel(classData);
        const savedClass = await newClass.save();

        const teacherIds = classData.subjects
        .filter(subj => subj.teacher)
        .map(subj => mongoose.Types.ObjectId(subj.teacher));

    // Remove duplicate teacher IDs
    const uniqueTeacherIds = [...new Set(teacherIds.map(id => id.toString()))];

    await TeacherModel.updateMany(
        { _id: { $in: uniqueTeacherIds } },
        { $addToSet: { classes: savedClass._id } }
    );
        // Redirect or send success response
        req.flash("success","class created successfully")
        res.redirect('/api/class/create-class'); // Adjust the redirect path as needed
    } catch (err) {
        console.error(err);
        req.flash('error',"class creation failed")
        res.status(500).send('Server Error');
    }
});



// router.post('/create-class', auth, async (req, res) => {
//     const { class_name, section, semester, subjects, students } = req.body;
//     try {
//         // Validate Subjects and (optionally) Teachers

//           // Check if 'subjects' is an array of strings
//           if (subjects.length > 0 && typeof subjects[0] === 'string') {
//             // Transform it into array of objects with 'subject' field
//             subjects = subjects.map(subId => ({ subject: subId }));
//         }
//         console.log(subjects)
//         for (let i = 0; i < subjects.length; i++) {
//             const { subject, teacher } = subjects[i];

//             console.log(subject)
//             // Check if Subject exists
//             const subjectExists = await SubjectModel.findById(subject);
//             if (!subjectExists) {
//                 return res.status(400).send(`Subject with ID ${subject} does not exist.`);
//             }

//             // If a teacher is provided, validate the teacher
//             if (teacher) {
//                 const teacherExists = await TeacherModel.findById(teacher);
//                 if (!teacherExists) {
//                     return res.status(400).send(`Teacher with ID ${teacher} does not exist.`);
//                 }

//                 // Optional: Verify that the Teacher is assigned to the Subject
//                 if (!teacherExists.subjects.includes(subject)) {
//                     return res.status(400).send(`Teacher with ID ${teacher} is not assigned to Subject with ID ${subject}.`);
//                 }
//             }
//         }

        
//         // Create new Class
//         const classObj = new ClassModel({
//             class_name,
//             semester,
//             section,
//             subjects,
//             students: students || []
//         });

//         await classObj.save();

//         res.status(201).send(classObj);
//     } catch (err) {
//         console.error('Error creating class:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });


router.get('/delete/:id', auth, async (req, res) => {
    const classId = req.params.id;

    try {
        const deletedClass = await ClassModel.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).send({ message: 'Class not found.' });
        }
req.flash("success","class deleted")
res.redirect('/api/admin/manage-classes')
        // res.status(200).send({ message: 'Class deleted successfully.', class: deletedClass });
    } catch (err) {
        console.error('Error deleting class:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.get('/update-class/:id',auth,async(req,res)=>{
    const classId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).send('Invalid Class ID');
    }

    try {
        // Fetch the class by ID
        const classData = await ClassModel.findById(classId).populate('subjects.subject').populate('subjects.teacher').populate('students');

        if (!classData) {
            return res.status(404).send('Class not found');
        }
      

        // Fetch subjects and teachers for dropdowns
        const subjectsList = await SubjectModel.find().select('_id subject_name subject_code');
        const teachersList = await TeacherModel.find().select('_id name');

        res.render('update-class', { 
            classData, 
            subjectsList, 
            teachersList, 
            errors: {} 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})




router.post('/update-class/:id', async (req, res) => {
    const classId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).send('Invalid Class ID');
    }

    // Extract data from form
    const { class_name, section, semester, subjects, students } = req.body;

    // Prepare data
    let classData = {
        class_name,
        section,
        semester,
        subjects: Array.isArray(subjects) ? subjects : [subjects], // Ensure subjects is an array
        students: students ? students.split(',').map(id => id.trim()) : []
    };
    // Validate data using Joi
    const { error } = validateClass(classData);
    
    if (error) {
        // Extract error details to send back to the form
        const errors = {};
        error.details.forEach(err => {
            const path = err.path;
            if (path[0] === 'subjects') {
                const index = path[1];
                const field = path[2];
                if (!errors.subjects) errors.subjects = [];
                if (!errors.subjects[index]) errors.subjects[index] = {};
                errors.subjects[index][field] = { message: err.message };
            } else {
                errors[path[0]] = { message: err.message };
            }
        });

        try {
            // Fetch subjects and teachers for dropdowns
            const subjectsList = await SubjectModel.find().select('_id subject_name subject_code ');
            const teachersList = await TeacherModel.find().select('_id name');

           
            res.status(400).render('update-class', { 
                classData: { _id: classId, ...classData }, 
                subjectsList, 
                teachersList, 
                errors 
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    } else {
        try {
            // Update the class
            // await ClassModel.findByIdAndUpdate(classId, classData, { new: true, runValidators: true });
            const existingClass = await ClassModel.findById(classId);

            if (!existingClass) {
                return res.status(404).send('Class not found');
            }

               const previousTeacherIds = existingClass.subjects
               .filter(subj => subj.teacher)
               .map(subj => subj.teacher.toString());

           // Determine new teacher assignments
           const newTeacherIds = classData.subjects
               .filter(subj => subj.teacher)
               .map(subj => subj.teacher.toString());

           // Identify teachers to add the class to
           const teachersToAdd = newTeacherIds.filter(id => !previousTeacherIds.includes(id));

           // Identify teachers to remove the class from
           const teachersToRemove = previousTeacherIds.filter(id => !newTeacherIds.includes(id));

           // Update the class document
           await ClassModel.findByIdAndUpdate(classId, classData, { new: true, runValidators: true });

           // Add class ID to newly assigned teachers
           if (teachersToAdd.length > 0) {
               await TeacherModel.updateMany(
                   { _id: { $in: teachersToAdd } },
                   { $addToSet: { classes: classId } }
               );
           }

           // Remove class ID from unassigned teachers
           if (teachersToRemove.length > 0) {
               await TeacherModel.updateMany(
                   { _id: { $in: teachersToRemove } },
                   { $pull: { classes: classId } }
               );
           }

           // Additionally, handle teachers who are still assigned but may have multiple subjects
           // Ensure that classId is present if a teacher is still assigned to any subject in this class
           const teachersStillAssigned = newTeacherIds.filter(id => previousTeacherIds.includes(id));
           if (teachersStillAssigned.length > 0) {
               await TeacherModel.updateMany(
                   { _id: { $in: teachersStillAssigned }, classes: { $ne: classId } },
                   { $addToSet: { classes: classId } }
               );
           }

            req.flash("success","Updated successfully")
            // Redirect or send success response
            res.redirect('/api/admin/manage-classes'); // Adjust the redirect path as needed
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
});






module.exports = router