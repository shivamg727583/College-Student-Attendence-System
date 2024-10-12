const express = require('express');
const TeacherAuth = require('../middlewares/TeacherAuth');
const router = express.Router();
const {TeacherModel} = require('../models/Teacher-model');
const {ClassModel} = require('../models/Class-model');
const {StudentModel} = require('../models/Student-model');
const {SubjectModel} = require('../models/Subject-model');
const {AttendanceModel} = require('../models/Attendence-model')


router.get("/mark-attendance",TeacherAuth,async(req,res)=>{
    try {
        // Fetch the logged-in Teacher
        const teacher = await TeacherModel.findById(req.teacher._id).populate('classes subjects').exec();
        if (!teacher) {
            return res.status(404).send('Teacher not found.');
        }

        // Fetch classes associated with the Teacher
        const classes = await ClassModel.find({ _id: { $in: teacher.classes } }).exec();
        const subjects = await SubjectModel.find({ _id: { $in: teacher.subjects } }).exec();

        res.render('mark-attendence', {
            user: teacher,
            classes: classes,
             subjects,
            students: null, // No students loaded yet
            selectedClass: null,
            selectedSemester: null,
            selectedBranch: null,
            selectedSection: null,
            selectedSubject:null,
        });
    } catch (err) {
        console.error('Error rendering mark attendance page:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/mark-attendance', TeacherAuth, async (req, res) => {
    const { class_name, semester, branch, section, subjectId } = req.body;

    console.log({body:req.body})

    console.log( { class_name, semester, branch, section, subjectId })

    try {

         // Retrieve the specific class document
         const classDoc = await ClassModel.findOne({
            class_name,
            semester,
            section
        }).populate('students').exec();

        console.log(classDoc)

        if (!classDoc) {
            return res.status(404).send('Class not found with the provided details.');
        }
        // Fetch the teacher and verify class association
        const teacher = await TeacherModel.findById(req.teacher._id).exec();
        if (!teacher.classes.includes(classDoc._id)) {
            return res.status(403).send('You are not authorized to mark attendance for this class.');
        }

       

        // Fetch students enrolled in the class
        const students = await StudentModel.find({ class: classDoc._id }).exec();

        // Fetch subjects and classes for the dropdowns
        const subjects = await SubjectModel.find({ _id: { $in: teacher.subjects } }).exec();
        const classes = await ClassModel.find({ _id: { $in: teacher.classes } }).exec();
        const selectedSubject = await SubjectModel.findById(subjectId).exec();

        res.render('mark-attendence', { // Ensure template name matches
            user: teacher,
            classes,
            subjects,
            students,
            selectedClass: classDoc._id,
            selectedSemester: semester,
            selectedBranch: branch,
            selectedSection: section,
            selectedSubject: selectedSubject ? selectedSubject._id : null
        });
    } catch (err) {
        console.error('Error processing mark attendance:', err);
        res.status(500).send('Server Error');
    }
});


// Handle Attendance Submission
router.post('/submit-attendance', TeacherAuth, async (req, res) => {
    const { class: classId, semester, branch,subject, section, attendance } = req.body;


    try {
        // Verify that the selected class is associated with the Teacher
        const teacher = await TeacherModel.findById(req.teacher._id).exec();
        
        if (!teacher.classes.includes(classId)) {
            return res.status(403).send('You are not authorized to mark attendance for this class.');
        }

        // Find the Class document
        const classDoc = await ClassModel.findById(classId).populate('students').exec();

    

        if (!classDoc) {
            return res.status(404).send('Class not found with the provided details.');
        }

        // Fetch students enrolled in the class
        const students = await StudentModel.find({ class: classDoc._id }).exec();


      


        try {
            for (let student of students) {
                let status = 'Absent';
                if (attendance && attendance.includes(student._id.toString())) {
                    status = 'Present';
                }

               
                const attendanceRecord = {
                    subject: subject, // Assuming Class has subjects. If multiple, adjust accordingly
                    date: new Date(), // Current date
                    status: status
                };

                const newAttendance  = await AttendanceModel.create({
                    student: student._id,
                    class: student.class,
                    subject: subject,
                    teacher: teacher._id,
                    date: new Date() ,
                    status: status,
        
                })

                console.log(newAttendance)
         
                student.attendance.push(attendanceRecord);
                await student.save();
                
            }

            res.redirect('/api/teachers/mark-attendance'); // Redirect back to the attendance page or show a success message
        } catch (err) {
       
            console.error('Error submitting attendance:', err);
            res.status(500).send('Server Error while submitting attendance.');
        }

    } catch (err) {
        console.error('Error processing attendance submission:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/view-attendance', TeacherAuth, async (req, res) => {
        try {
            const { classId, subjectId, semester, branch, section } = req.query;
    
            // Fetch filter data
            const classes = await ClassModel.find({ /* your criteria */ }).exec();
            const subjects = await SubjectModel.find({ /* your criteria */ }).exec();
            const semesters = [...new Set(classes.map(cls => cls.semester))].sort((a, b) => a - b);
            const branches = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]; // Or fetch dynamically
            const sections = [...new Set(classes.map(cls => cls.section))].sort();
    
            // Build filter object
            let filter = {};
            if (classId) filter.class = classId;
            if (subjectId) filter.subject = subjectId;
            if (semester) filter.semester = semester;
            if (branch) filter.branch = branch;
            if (section) filter.section = section;
    
            // Fetch attendance records based on filters
            // Assuming AttendanceRecord schema has references to student, subject, class, etc.
            const attendanceData = await AttendanceModel.find(filter)
                .populate('student')
                .populate('subject')
                .exec();
    
            // Process attendance data to structure it per student with subjects
            const attendanceMap = {};
    
            attendanceData.forEach(record => {
                const studentId = record.student._id.toString();
                if (!attendanceMap[studentId]) {
                    attendanceMap[studentId] = {
                        student: record.student,
                        attendance: {},
                        overall: { totalClasses: 0, presentClasses: 0 }
                    };
                }
    
                const subjectId = record.subject._id.toString();
                if (!attendanceMap[studentId].attendance[subjectId]) {
                    attendanceMap[studentId].attendance[subjectId] = {
                        subjectName: record.subject.subject_name,
                        totalClasses: 0,
                        presentClasses: 0
                    };
                }
    
                attendanceMap[studentId].attendance[subjectId].totalClasses += 1;
                if (record.status === 'Present') {
                    attendanceMap[studentId].attendance[subjectId].presentClasses += 1;
                    attendanceMap[studentId].overall.presentClasses += 1;
                }
                attendanceMap[studentId].overall.totalClasses += 1;
            });
    
            // Convert map to array
            const attendanceRecords = Object.values(attendanceMap);
    
            // Calculate summary statistics
            const totalClasses = attendanceRecords.length > 0 ? attendanceRecords[0].overall.totalClasses : 0;
            const totalAttendance = attendanceRecords.reduce((acc, record) => acc + record.overall.presentClasses, 0);
            const averageAttendance = attendanceRecords.length > 0 ? (totalAttendance / (attendanceRecords.length * totalClasses) * 100).toFixed(2) : '0.00';
            const overallAttendance = attendanceRecords.length > 0 ? ((totalAttendance / (attendanceRecords.length * totalClasses)) * 100).toFixed(2) : '0.00';
    
            res.render('view-attendance', {
                user: req.user, // Assuming user data is attached by TeacherAuth
                classes,
                subjects,
                semesters,
                branches,
                sections,
                attendanceRecords,
                totalClasses,
                averageAttendance,
                overallAttendance,
                // Pass selected filters to maintain state in the form
                selectedClass: classId || '',
                selectedSubject: subjectId || '',
                selectedSemester: semester || '',
                selectedBranch: branch || '',
                selectedSection: section || ''
            });
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            res.status(500).send('Server Error');
        }
    });


module.exports = router;