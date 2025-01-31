const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middlewares/AdminAuth');
const { ClassModel, validateClass } = require('../models/Class-model');
const { SubjectModel } = require('../models/Subject-model');
const { TeacherModel } = require('../models/Teacher-model');
const { StudentModel } = require('../models/Student-model');
const { AttendanceModel } = require('../models/Attendence-model');

// Admin controller part for creating a class
router.get('/create-class', auth, async (req, res) => {
    try {
        const subjects = await SubjectModel.find().select('_id subject_name subject_code');
        const teachers = await TeacherModel.find().select('_id name');
        const students = await StudentModel.find().select('_id name');
        
        res.render('create-class', { 
            formData: {},
            errors: {},
            subjects,
            teachers,
            students,
            successMessage: req.flash('success'),
            errorMessages: req.flash('error')
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST /classes - Handle form submission to create a new class
router.post('/create-class', async (req, res) => {
    const { class_name, section, semester, subjects, students } = req.body;
    let classData = {
        class_name,
        section,
        semester,
        subjects: Array.isArray(subjects) ? subjects : [subjects],
        students: students ? students.split(',').map(id => id.trim()) : []
    };

    // Validate data using Joi
    const { error } = validateClass(classData);
    if (error) {
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

        // Re-render the form with errors
        return res.status(400).render('create-class', {
            formData: classData,
            errors,
            subjects: await SubjectModel.find().select('_id name'),
            teachers: await TeacherModel.find().select('_id name'),
            students: await StudentModel.find().select('_id name')
        });
    }

    try {
        const newClass = new ClassModel(classData);
        const savedClass = await newClass.save();

        const teacherIds = classData.subjects
            .filter(subj => subj.teacher)
            .map(subj => mongoose.Types.ObjectId(subj.teacher));

        const uniqueTeacherIds = [...new Set(teacherIds.map(id => id.toString()))];

        await TeacherModel.updateMany(
            { _id: { $in: uniqueTeacherIds } },
            { $addToSet: { classes: savedClass._id } }
        );

        req.flash("success", "Class created successfully");
        res.redirect('/api/class/create-class');
    } catch (err) {
        console.error(err);
        req.flash('error', "Class creation failed");
        res.status(500).send('Server Error');
    }
});

// DELETE /classes/:id - Handle class deletion
router.get('/delete/:id', auth, async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        req.flash("error", "Invalid Class ID.");
        return res.redirect('/api/admin/manage-classes');
    }

    try {
        const deletedClass = await ClassModel.findByIdAndDelete(classId);
        if (!deletedClass) {
            req.flash("error", "Class not found.");
            return res.redirect('/api/admin/manage-classes');
        }

        // Remove the class from all teachers' "classes" array
        await TeacherModel.updateMany(
            { classes: classId },
            { $pull: { classes: classId } }
        );

        // Remove the class from all students' "class" field by setting it to null
        await StudentModel.updateMany(
            { class: classId },
            { $set: { class: null } }
        );

        req.flash("success", "Class deleted successfully.");
        res.redirect('/api/admin/manage-classes');
    } catch (err) {
        console.error('Error deleting class:', err);
        req.flash("error", "An error occurred while deleting the class.");
        res.redirect('/api/admin/manage-classes');
    }
});

// GET /classes/:id - Handle fetching the class details for updating
router.get('/update-class/:id', auth, async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).send('Invalid Class ID');
    }

    try {
        const classData = await ClassModel.findById(classId)
            .populate('subjects.subject')
            .populate('subjects.teacher')
            .populate('students');

        if (!classData) {
            return res.status(404).send('Class not found');
        }

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
});

// POST /classes/update/:id - Handle class update
router.post('/update-class/:id', async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).send('Invalid Class ID');
    }

    const { class_name, section, semester, subjects, students } = req.body;
    let classData = {
        class_name,
        section,
        semester,
        subjects: Array.isArray(subjects) ? subjects : [subjects],
        students: students ? students.split(',').map(id => id.trim()) : []
    };

    const { error } = validateClass(classData);
    if (error) {
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

        const subjectsList = await SubjectModel.find().select('_id subject_name subject_code');
        const teachersList = await TeacherModel.find().select('_id name');

        res.status(400).render('update-class', {
            classData: { _id: classId, ...classData },
            subjectsList,
            teachersList,
            errors
        });
    } else {
        try {
            const existingClass = await ClassModel.findById(classId);
            if (!existingClass) {
                return res.status(404).send('Class not found');
            }

            const previousTeacherIds = existingClass.subjects
                .filter(subj => subj.teacher)
                .map(subj => subj.teacher.toString());

            const newTeacherIds = classData.subjects
                .filter(subj => subj.teacher)
                .map(subj => subj.teacher.toString());

            const teachersToAdd = newTeacherIds.filter(id => !previousTeacherIds.includes(id));
            const teachersToRemove = previousTeacherIds.filter(id => !newTeacherIds.includes(id));

            await ClassModel.findByIdAndUpdate(classId, classData, { new: true, runValidators: true });

            if (teachersToAdd.length > 0) {
                await TeacherModel.updateMany(
                    { _id: { $in: teachersToAdd } },
                    { $addToSet: { classes: classId } }
                );
            }

            if (teachersToRemove.length > 0) {
                await TeacherModel.updateMany(
                    { _id: { $in: teachersToRemove } },
                    { $pull: { classes: classId } }
                );
            }

            req.flash("success", "Class updated successfully");
            res.redirect('/api/admin/manage-classes');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
});

// GET /api/admin - Fetch class data (for dropdown filters)
router.get('/', async (req, res) => {
    try {
        const { semester, branch } = req.query;
        let query = {};
        if (semester) query.semester = semester;
        if (branch) query.class_name = branch;

        const branches = !branch ? await ClassModel.distinct('class_name', query) : null;
        const sections = branch ? await ClassModel.distinct('section', query) : null;

        res.json({
            branches: branches || [],
            sections: sections || []
        });
    } catch (error) {
        console.error("Error fetching classes data:", error);
        res.status(500).json({ error: "Server error occurred while fetching classes data." });
    }
});

module.exports = router;
