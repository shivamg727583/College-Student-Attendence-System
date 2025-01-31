const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { TeacherModel } = require("../models/Teacher-model");
const { SubjectModel } = require("../models/Subject-model");
const { ClassModel } = require("../models/Class-model");
const { StudentModel } = require('../models/Student-model');
const { AttendanceModel } = require('../models/Attendence-model');

const auth = require("../middlewares/AdminAuth");

// ✅ Get all subjects
router.get('/manage-subjects', auth, async (req, res) => {
    try {
        const subjects = await SubjectModel.find();
        res.json({ success: true, subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load subjects", error });
    }
});

// ✅ Get all classes
router.get('/manage-classes', auth, async (req, res) => {
    try {
        const classes = await ClassModel.find();
        res.json({ success: true, classes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load classes", error });
    }
});

// ✅ Get all students
router.get('/manage-students', auth, async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load students", error });
    }
});

// ✅ Get attendance report with filters
router.post('/attendance-report', auth, async (req, res) => {
    try {
        const { semesterFilter, branchFilter, sectionFilter, teacherFilter, dateFilter, subjectFilter } = req.body;

        let query = {};
        if (semesterFilter) query['class.semester'] = semesterFilter;
        if (branchFilter) query['class.class_name'] = branchFilter;
        if (sectionFilter) query['class.section'] = sectionFilter;
        if (teacherFilter && mongoose.Types.ObjectId.isValid(teacherFilter)) {
            query.teacher = new mongoose.Types.ObjectId(teacherFilter);
        }
        if (subjectFilter && mongoose.Types.ObjectId.isValid(subjectFilter)) {
            query.subject = new mongoose.Types.ObjectId(subjectFilter);
        }
        if (dateFilter) {
            const startDate = new Date(dateFilter);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reports = await AttendanceModel.find(query)
            .populate('student', 'name enrollment_number')
            .populate('class', 'semester class_name section')
            .populate('subject', 'subject_name subject_code')
            .populate('teacher', 'name')
            .sort({ date: -1 });

        res.json({ success: true, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching attendance reports", error });
    }
});

module.exports = router;
