const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const { TeacherModel, validateTeacher } = require("../models/Teacher-model");
const { SubjectModel } = require("../models/Subject-model");
const { ClassModel } = require("../models/Class-model");
const {StudentModel} = require('../models/Student-model');
const {AttendanceModel} = require('../models/Attendence-model')


const auth = require("../middlewares/AdminAuth");
const TeacherAuth = require("../middlewares/TeacherAuth");

router.get('/manage-subjects',async(req,res)=>{
    const subjects = await SubjectModel.find({}).exec();
    res.render('manage-subject',{
        successMessage: req.flash('success'),
        errorMessages: req.flash('error'),
        subjects: subjects,
        user:req.admin
    })
})

router.get('/manage-classes',async (req,res)=>{
try {
    const classes = await ClassModel.find({}).exec();
    res.render('manage-class',{
        successMessage: req.flash('success'),
        errorMessages: req.flash('error')    ,
        classes: classes,
        user:req.admin
    })
    
} catch (error) {
    console.log(error)
    res.send("failed in load classes : ",error)
}
   
})

router.get('/manage-students',async (req,res)=>{
    const students = await StudentModel.find({}).exec();

        
    res.render('manage-students',{
        successMessage: req.flash('success'),
        errorMessages: req.flash('error')   ,
        students: students,
        user:req.admin
    })
})



router.get('/manage-attendance', async (req, res) => {
    try {
        // Fetch filter options (all classes, teachers, and subjects)
        const classes = await ClassModel.find().populate('students')
        const teachers = await TeacherModel.find().populate('teachingSchedule.subjectId');
        const subjects = await SubjectModel.find();

        const reports = await AttendanceModel
        .find()
        .populate('student') // Populating student details (name, roll number)
        .populate('class') // Populating class details (class name)
        .populate('subject') // Populating subject details (subject name)
        .populate('teacher') // Populating teacher details (teacher name)
        .sort({ date: -1 }) // Sorting by the latest date first
        .limit(100); // Limit to recent 100 entries

        const semesters = await ClassModel.distinct('semester');
        // Render the attendance report page
        res.render('attendance-report', {
            classes,
            teachers,
            subjects,
            reports,
            semesters,
        });
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).send('Server error');
    }
});

// POST route to filter attendance report

router.post('/attendance-report', async (req, res) => {
    try {
        const {
            semesterFilter,
            branchFilter,
            sectionFilter,
            teacherFilter,
            dateFilter,
            subjectFilter
        } = req.body;

        console.log("Request body:", req.body);

        // Build the query dynamically
        let query = {};

        // Class Filters
        if (semesterFilter) query['class.semester'] = semesterFilter;
        if (branchFilter) query['class.class_name'] = branchFilter;
        if (sectionFilter) query['class.section'] = sectionFilter;

        // Teacher and Subject Filters
        if (teacherFilter && mongoose.Types.ObjectId.isValid(teacherFilter)) {
            query.teacher =new mongoose.Types.ObjectId(teacherFilter);
        }
        if (subjectFilter && mongoose.Types.ObjectId.isValid(subjectFilter)) {
            query.subject =new mongoose.Types.ObjectId(subjectFilter);
        }

        // Date Filter
        if (dateFilter) {
            const startDate = new Date(dateFilter);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); // Increment by 1 day for range filtering
            query.date = { $gte: startDate, $lt: endDate };
        }

        console.log("Generated query:", query);

        // Fetch filtered attendance records
        const reports = await AttendanceModel.find(query)
            .populate('student', 'name enrollment_number') // Fetch student details with name and roll number
            .populate('class', 'semester class_name section') // Fetch class details with specific fields
            .populate('subject', 'subject_name subject_code') // Fetch subject details
            .populate('teacher', 'name') // Fetch teacher name
            .sort({ date: -1 });

        console.log("Attendance reports:", reports);

        // Fetch unique values for dropdowns (filters)
        const semesters = await ClassModel.distinct('semester');
        const branches = await ClassModel.distinct('branch');
        const sections = await ClassModel.distinct('section');
        const teachers = await TeacherModel.find({}, '_id name'); // Fetch all teachers with their IDs and names
        const subjects = await SubjectModel.find({}, '_id subject_name subject_code'); // Fetch all subjects


      

        // Render the attendance report with the filtered data
        res.render('attendance-report', {
            semesters,
            branches,
            sections,
            teachers,
            subjects,
            reports,
        });
    } catch (error) {
        console.error("Error in filtering attendance report:", error);
        res.status(500).json({ error: "Server error occurred while fetching attendance reports." });
    }
});














module.exports = router;




  