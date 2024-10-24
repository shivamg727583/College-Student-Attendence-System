const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { StudentModel, validateStudent } = require('../models/Student-model'); 
const { ClassModel } = require('../models/Class-model'); 
const { promisify } = require('util');

// Promisify unlink for async/await
const unlinkAsync = promisify(fs.unlink);

module.exports.RegisterStudents = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            req.flash('error', 'No file uploaded.');
            return res.redirect('/api/students/register');
        }

        const filePath = path.join(__dirname, '..', req.file.path);
        const ext = path.extname(req.file.originalname).toLowerCase();
        let students = [];

        console.log(`Processing file: ${req.file.originalname}, Path: ${filePath}`);

        // Parse file based on extension
        if (ext === '.csv') {
            students = await parseCSV(filePath);
        } else if (ext === '.xlsx' || ext === '.xls') {
            students = parseExcel(filePath);
        } else {
            req.flash('error', 'Unsupported file format.');
            await unlinkAsync(filePath);
            return res.redirect('/api/students/register');
        }

        console.log(`Parsed ${students.length} students from file.`);

        // Validate each student
        const validatedStudents = [];
        const invalidEntries = [];

        for (let student of students) {
            const { error, value } = validateStudent(student);
            if (error) {
                invalidEntries.push(`Enrollment Number: ${student.enrollment_number || 'N/A'} - ${error.details[0].message}`);
            } else {
                validatedStudents.push(value);
            }
        }

        console.log(`Validated Students: ${validatedStudents.length}, Invalid Entries: ${invalidEntries.length}`);

        if (invalidEntries.length > 0) {
            req.flash('error', invalidEntries.join('<br>'));
            await unlinkAsync(filePath);
            return res.redirect('/api/students/register');
        }

        // Prevent duplicate inserts by checking existing emails and enrollment numbers
        const existingStudents = await StudentModel.find({
            $or: [
                { email: { $in: validatedStudents.map(s => s.email) } },
                { enrollment_number: { $in: validatedStudents.map(s => s.enrollment_number) } }
            ]
        });

        const existingEmails = existingStudents.map(s => s.email);
        const existingEnrollmentNumbers = existingStudents.map(s => s.enrollment_number);

        // Filter unique students
        const uniqueStudents = validatedStudents.filter(s => 
            !existingEmails.includes(s.email) && !existingEnrollmentNumbers.includes(s.enrollment_number)
        );

        const duplicateEntries = validatedStudents.filter(s => 
            existingEmails.includes(s.email) || existingEnrollmentNumbers.includes(s.enrollment_number)
        ).map(s => `Enrollment Number: ${s.enrollment_number} - Duplicate email or enrollment number.`);

        if (duplicateEntries.length > 0) {
            req.flash('error', duplicateEntries.join('<br>'));
        }

        if (uniqueStudents.length === 0) {
            req.flash('error', 'No unique students to register.');
            await unlinkAsync(filePath);
            return res.redirect('/api/students/register');
        }

        // Insert unique students into MongoDB
        const insertedStudents = await StudentModel.insertMany(uniqueStudents, { ordered: false });

        console.log(`Inserted ${insertedStudents.length} unique students into the database.`);

        // Extract class details to minimize database queries
        const classDetails = {};

        insertedStudents.forEach(student => {
            const key = `${student.class_name}|${student.section}|${student.semester}`;
            if (!classDetails[key]) {
                classDetails[key] = [];
            }
            classDetails[key].push(student._id);
        });

        // Fetch all relevant classes in one query
        const classKeys = Object.keys(classDetails).map(key => {
            const [class_name, section, semester] = key.split('|');
            return { class_name, section, semester };
        });

        const classes = await ClassModel.find({
            $or: classKeys.map(key => ({
                class_name: key.class_name,
                section: key.section,
                semester: key.semester
            }))
        });

        // Map classes for easy access
        const classMap = {};
        classes.forEach(cls => {
            const key = `${cls.class_name}|${cls.section}|${cls.semester}`;
            classMap[key] = cls;
        });

        // Prepare bulk operations for updating classes and creating missing ones
        const bulkOps = [];

        for (const key in classDetails) {
            const cls = classMap[key];
            if (cls) {
                // If class exists, push student IDs
                bulkOps.push({
                    updateOne: {
                        filter: { _id: cls._id },
                        update: { $push: { students: { $each: classDetails[key] } } }
                    }
                });
            } else {
                // If class does not exist, create it and add student IDs
                const [class_name, section, semester] = key.split('|');
                bulkOps.push({
                    insertOne: {
                        document: {
                            class_name,
                            section,
                            semester,
                            subjects: [], // Initialize as per requirement
                            students: classDetails[key]
                        }
                    }
                });
                console.warn(`Class not found. Created new class for Class Name: ${class_name}, Section: ${section}, Semester: ${semester}.`);
            }
        }

        // Execute bulk operations if any
        if (bulkOps.length > 0) {
            const bulkWriteResult = await ClassModel.bulkWrite(bulkOps);
            console.log(`Bulk write result: ${JSON.stringify(bulkWriteResult)}`);
        }

        // Final flash message
        if (duplicateEntries.length > 0) {
            req.flash('error', `${insertedStudents.length} students registered successfully.<br>However, the following entries were duplicates and not registered:<br>${duplicateEntries.join('<br>')}`);
        } else {
            req.flash('success', `${insertedStudents.length} students registered successfully and linked to their classes.`);
        }

        await unlinkAsync(filePath);
        res.redirect('/api/students/register');

    } catch (error) {
        console.error('Error in upload registration:', error);
        req.flash('error', 'An error occurred during registration.');
        res.redirect('/api/students/register');
    }
};

// Helper function to parse CSV
function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const students = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const student = {
                    name: row.name,
                    email: row.email,
                    enrollment_number: row.enrollment_number,
                    class_name: row.class_name,
                    section: row.section,
                    semester: parseInt(row.semester, 10)
                };
                students.push(student);
            })
            .on('end', () => {
                resolve(students);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Helper function to parse Excel
function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
    const students = jsonData.map((row) => ({
        name: row.name,
        email: row.email,
        enrollment_number: row.enrollment_number,
        class_name: row.class_name,
        section: row.section,
        semester: parseInt(row.semester, 10)
    }));

    return students;
}
