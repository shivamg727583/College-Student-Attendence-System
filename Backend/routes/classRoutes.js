const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middlewares/AdminAuth');
const { ClassModel, validateClass } = require('../models/Class-model');
const { SubjectModel } = require('../models/Subject-model');
const { TeacherModel } = require('../models/Teacher-model');
const { StudentModel } = require('../models/Student-model');

// 🟢 GET ALL CLASSES (For Frontend Display)
router.get('/', auth, async (req, res) => {
    try {
        const classes = await ClassModel.find()
            .populate('subjects.subject', 'subject_name subject_code')
            .populate('subjects.teacher', 'name')
            .populate('students', 'name');

        res.status(200).json({ success: true, classes });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


// 🟢 CREATE NEW CLASS
router.post('/create', auth, async (req, res) => {
    try {
        let { class_name, section, semester, subjects, students } = req.body;

        // Ensure subjects is an array
        subjects = Array.isArray(subjects) ? subjects : [subjects];
        students = students ? students.split(',').map(id => id.trim()) : []; // Ensure students is an array of IDs

        const classData = { class_name, section, semester, subjects, students };

        // Validate input data
        const { error } = validateClass(classData);
        if (error) return res.status(400).json({ success: false, errors: error.details });

        // Process subjects to ensure teacher IDs are valid ObjectIds
        const processedSubjects = subjects.map(subj => {
            if (subj.teacher && mongoose.Types.ObjectId.isValid(subj.teacher)) {
                // Corrected to use 'new' keyword when creating ObjectId
                subj.teacher = new mongoose.Types.ObjectId(subj.teacher); // Ensure teacher ID is an ObjectId
            } else {
                subj.teacher = null; // Ensure no invalid teacher ID is assigned
            }
            return subj;
        });

        // Create new class
        const newClass = new ClassModel({ ...classData, subjects: processedSubjects });
        const savedClass = await newClass.save();

        // Add class ID to teachers' records (if assigned)
        const teacherIds = processedSubjects
            .filter(subj => subj.teacher)
            .map(subj => subj.teacher); // Get unique teacher IDs (already validated ObjectIds)

        const uniqueTeacherIds = [...new Set(teacherIds)]; // Ensure teachers are added only once

        await TeacherModel.updateMany(
            { _id: { $in: uniqueTeacherIds } },
            { $addToSet: { classes: savedClass._id } } // Add class ID to teachers' records
        );

        res.status(201).json({ success: true, message: 'Class created successfully', class: savedClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});



// 🟢 DELETE A CLASS
router.delete('/delete/:id', auth, async (req, res) => {
    const classId = req.params.id;
console.log(classId)
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ success: false, message: 'Invalid Class ID' });
    }

    try {
        const deletedClass = await ClassModel.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        console.log("deleteclass ",deletedClass)
        // Remove class from teachers and students
        await TeacherModel.updateMany({ classes: classId }, { $pull: { classes: classId } });
        await StudentModel.updateMany({ class: classId }, { $set: { class: null } });

        res.status(200).json({ success: true, message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 🟢 GET CLASS DETAILS (For Editing)
router.get('/:id', auth, async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ success: false, message: 'Invalid Class ID' });
    }

    try {
        const classData = await ClassModel.findById(classId)
            .populate('subjects.subject', 'subject_name subject_code')
            .populate('subjects.teacher', 'name')
            .populate('students', 'name');

        if (!classData) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        res.status(200).json({ success: true, class: classData });
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 🟢 UPDATE A CLASS
router.put('/update/:id', auth, async (req, res) => {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ success: false, message: 'Invalid Class ID' });
    }

    try {
        let { class_name, section, semester, subjects, students } = req.body;

        subjects = Array.isArray(subjects) ? subjects : [subjects];
        students = students ? students.split(',').map(id => id.trim()) : [];

        const classData = { class_name, section, semester, subjects, students };

        const { error } = validateClass(classData);
        if (error) return res.status(400).json({ success: false, errors: error.details });

        const existingClass = await ClassModel.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        // Get previous teacher IDs and new teacher IDs
        const previousTeacherIds = existingClass.subjects.map(subj => subj.teacher?.toString());
        const newTeacherIds = subjects.map(subj => subj.teacher?.toString());

        const teachersToAdd = newTeacherIds.filter(id => id && !previousTeacherIds.includes(id));
        const teachersToRemove = previousTeacherIds.filter(id => id && !newTeacherIds.includes(id));

        // Update class
        const updatedClass = await ClassModel.findByIdAndUpdate(classId, classData, { new: true, runValidators: true });

        // Update teachers' classes
        if (teachersToAdd.length > 0) {
            await TeacherModel.updateMany({ _id: { $in: teachersToAdd } }, { $addToSet: { classes: classId } });
        }
        if (teachersToRemove.length > 0) {
            await TeacherModel.updateMany({ _id: { $in: teachersToRemove } }, { $pull: { classes: classId } });
        }

        res.status(200).json({ success: true, message: 'Class updated successfully', class: updatedClass });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
