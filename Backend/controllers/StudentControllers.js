const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { StudentModel, validateStudent } = require('../models/Student-model');
const { ClassModel } = require('../models/Class-model');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

module.exports.RegisterStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = path.join(__dirname, '..', req.file.path);
        const ext = path.extname(req.file.originalname).toLowerCase();
        let students = [];

        console.log(`Processing file: ${req.file.originalname}`);

        if (ext === '.csv') {
            students = await parseCSV(filePath);
        } else if (ext === '.xlsx' || ext === '.xls') {
            students = parseExcel(filePath);
        } else {
            await unlinkAsync(filePath);
            return res.status(400).json({ message: 'Unsupported file format. Please upload CSV or XLSX.' });
        }

        if (students.length === 0) {
            await unlinkAsync(filePath);
            return res.status(400).json({ message: 'Uploaded file is empty or invalid.' });
        }

        let validatedStudents = [];
        let errors = [];

        for (let student of students) {
            const { error, value } = validateStudent(student);
            if (error) {
                errors.push({ enrollment_number: student.enrollment_number || 'N/A', error: error.details[0].message });
            } else {
                validatedStudents.push(value);
            }
        }

        if (errors.length > 0) {
            await unlinkAsync(filePath);
            return res.status(400).json({ message: 'Validation errors', errors });
        }

        const existingStudents = await StudentModel.find({
            $or: [
                { email: { $in: validatedStudents.map(s => s.email) } },
                { enrollment_number: { $in: validatedStudents.map(s => s.enrollment_number) } }
            ]
        });

        const existingEmails = new Set(existingStudents.map(s => s.email));
        const existingEnrollmentNumbers = new Set(existingStudents.map(s => s.enrollment_number));

        const uniqueStudents = validatedStudents.filter(s =>
            !existingEmails.has(s.email) && !existingEnrollmentNumbers.has(s.enrollment_number)
        );

        if (uniqueStudents.length === 0) {
            await unlinkAsync(filePath);
            return res.status(400).json({ message: 'All students are duplicates. No new registrations.' });
        }

        const insertedStudents = await StudentModel.insertMany(uniqueStudents, { ordered: false });

        const classUpdates = {};

        insertedStudents.forEach(student => {
            const key = `${student.class_name}|${student.section}|${student.semester}`;
            if (!classUpdates[key]) {
                classUpdates[key] = [];
            }
            classUpdates[key].push(student._id);
        });

        const classQueries = Object.keys(classUpdates).map(key => {
            const [class_name, section, semester] = key.split('|');
            return { class_name, section, semester };
        });

        const classes = await ClassModel.find({ $or: classQueries });

        const classMap = {};
        classes.forEach(cls => {
            const key = `${cls.class_name}|${cls.section}|${cls.semester}`;
            classMap[key] = cls;
        });

        const bulkOps = [];

        for (const key in classUpdates) {
            if (classMap[key]) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: classMap[key]._id },
                        update: { $push: { students: { $each: classUpdates[key] } } }
                    }
                });
            } else {
                const [class_name, section, semester] = key.split('|');
                bulkOps.push({
                    insertOne: {
                        document: { class_name, section, semester, subjects: [], students: classUpdates[key] }
                    }
                });
            }
        }

        if (bulkOps.length > 0) {
            await ClassModel.bulkWrite(bulkOps);
        }

        await unlinkAsync(filePath);
        res.status(201).json({
            message: `${insertedStudents.length} students registered successfully and linked to classes.`,
            inserted: insertedStudents.length,
            errors
        });

    } catch (error) {
        console.error('Error registering students:', error);
        res.status(500).json({ message: 'Server error during student registration.', error: error.message });
    }
};

// 🔽 Helper functions to parse CSV and Excel files

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const students = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                students.push({
                    name: row.name,
                    email: row.email,
                    enrollment_number: row.enrollment_number,
                    class_name: row.class_name,
                    section: row.section,
                    semester: parseInt(row.semester, 10)
                });
            })
            .on('end', () => resolve(students))
            .on('error', (error) => reject(error));
    });
}

function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet).map(row => ({
        name: row.name,
        email: row.email,
        enrollment_number: row.enrollment_number,
        class_name: row.class_name,
        section: row.section,
        semester: parseInt(row.semester, 10)
    }));
}
