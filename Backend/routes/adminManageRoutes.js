const express = require('express')
const router = express.Router();
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

        // Render the attendance report page
        res.render('attendance-report', {
            classes,
            teachers,
            subjects,
            reports
        });
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).send('Server error');
    }
});

// POST route to filter attendance report
router.post('/attendance-report', async (req, res) => {
    try {
        const { classFilter, teacherFilter, dateFilter, subjectFilter } = req.body;

        console.log("body:",req.body)

        // Build the query dynamically based on filters
        let query = {};

        if (classFilter) query.class_name = classFilter;
        if (teacherFilter) query.teacher_name = teacherFilter;
        if (dateFilter) query.date = { $gte: new Date(dateFilter), $lt: new Date(new Date(dateFilter).setDate(new Date(dateFilter).getDate() + 1)) };
        if (subjectFilter) query.subject = subjectFilter;

        // Fetch filtered attendance records
        const reports = await AttendanceModel.find(query)
        .populate('student') // Populating student details (name, roll number)
        .populate('class') // Populating class details (class name)
        .populate('subject') // Populating subject details (subject name)
        .populate('teacher') // Populating teacher details (teacher name)
        .sort({ date: -1 });

        console.log('report ',reports)

        // Fetch classes, teachers, subjects for the filters again
        const classes = await ClassModel.find();
        const teachers = await TeacherModel.find();
        const subjects = await SubjectModel.find();

        // Render the attendance report with filtered data
        res.render('attendance-report', {
            classes,
            teachers,
            subjects,
            reports
        });
    } catch (error) {
        console.error('Error filtering attendance report:', error);
        res.status(500).send('Server error');
    }
});











module.exports = router;




  