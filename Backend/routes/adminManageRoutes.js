const express = require('express')
const router = express.Router();
const { TeacherModel, validateTeacher } = require("../models/Teacher-model");
const { SubjectModel } = require("../models/Subject-model");
const { ClassModel } = require("../models/Class-model");
const {StudentModel} = require('../models/Student-model')


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

    const classes = await ClassModel.find({}).exec();
    res.render('manage-class',{
        successMessage: req.flash('success'),
        errorMessages: req.flash('error')    ,
        classes: classes,
        user:req.admin
    })
})

router.get('/manage-students',async (req,res)=>{
    const students = await StudentModel.find({})
            .populate('class') // Assuming 'class' is a reference
            .exec();
    res.render('manage-students',{
        successMessage: req.flash('success'),
        errorMessages: req.flash('error')   ,
        students: students,
        user:req.admin
    })
})

module.exports = router;




  