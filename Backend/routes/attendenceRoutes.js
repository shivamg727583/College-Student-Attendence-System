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
        const teacher = await TeacherModel.findById(req.teacher._id).populate('teachingSchedule.subjectId').exec();
        if (!teacher) {
            return res.status(404).send('Teacher not found.');
        }

      // Extract unique class_names, sections, semesters, and subjects from teachingSchedule
      const classesSet = new Set();
      const sectionsSet = new Set();
      const semestersSet = new Set();
      const subjectsSet = new Set();

      teacher.teachingSchedule.forEach(schedule => {
          classesSet.add(schedule.class_name);
          sectionsSet.add(schedule.section);
          semestersSet.add(schedule.semester);
          subjectsSet.add(JSON.stringify(schedule.subjectId)); // Use JSON.stringify to ensure uniqueness based on ObjectId
      });

      // Convert Sets to Arrays
      const classes = Array.from(classesSet);
      const sections = Array.from(sectionsSet);
      const semesters = Array.from(semestersSet);
      const subjects = Array.from(subjectsSet).map(subjectStr => JSON.parse(subjectStr));

      // Optional: Sort the arrays for better UI presentation
      classes.sort();
      sections.sort();
      semesters.sort((a, b) => Number(a) - Number(b)); // Assuming semesters are numeric strings
      subjects.sort((a, b) => a.subject_name.localeCompare(b.subject_name));
      
      

        res.render('mark-attendence', {
            user: teacher,
             classes: classes,           // Array of unique class names
            subjects: subjects,         // Array of unique subject objects
            sections: sections,         // Array of unique sections
            semesters: semesters, 
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

router.post("/get-students", TeacherAuth, async (req, res) => {
    try {
        const { class_name, section, semester, subjectId } = req.body;

        console.log({body:req.body})

        if (!class_name || !section || !semester || !subjectId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Fetch students based on class, section, semester, and subject
        const students = await StudentModel.find({
            class_name: 'cs',
            section: 'D',
            semester: 8,
        }).exec();

      const selectedSubject = await SubjectModel.findById(subjectId);
      const x = await TeacherModel.findById(req.teacher._id).populate('teachingSchedule.subjectId').select('teachingSchedule').teachingSchedule
       const subjects =   req.teacher.teachingSchedule.map(ts => ts.subjectId);
    //   console.log(subjects);
      
   console.log(x)

        res.render('mark-attendence', { // Render the same EJS template with students
            user: req.teacher,
            classes: Array.from(new Set(req.teacher.teachingSchedule.map(ts => ts.class_name))),
            subjects,
            sections: Array.from(new Set(req.teacher.teachingSchedule.map(ts => ts.section))),
            semesters: Array.from(new Set(req.teacher.teachingSchedule.map(ts => ts.semester))),
            students: students,
            selectedClass: class_name,
            selectedSemester: semester,
            selectedSection: section,
            selectedSubject, // Fetch the selected subject
        });
    } catch (err) {
        console.error('Error fetching students:', err);
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
req.flash('success',"Attendence submitted")
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