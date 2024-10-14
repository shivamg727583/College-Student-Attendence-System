const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { StudentModel, validateStudent } = require('../models/Student-model'); // Adjust path as needed
const { promisify } = require('util');

// Promisify unlink for async/await
const unlinkAsync = promisify(fs.unlink);

module.exports.RegisterStudents =  async (req, res) => {
        try {
            if (!req.file) {
                req.flash('error', 'No file uploaded.');
                return res.redirect('/api/students/register');
            }
    
            const filePath = path.join(__dirname, '..', req.file.path);
            const ext = path.extname(req.file.originalname).toLowerCase();
            let students = [];
    
            console.log(`Processing file: ${req.file.originalname}, Path: ${filePath}`);
    
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
    
            // Validate Each Student
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
    
            // Insert into MongoDB
            const result = await StudentModel.insertMany(validatedStudents, { ordered: false });
    
            console.log(`Inserted ${result.length} students into the database.`);
    
            req.flash('success', `${result.length} students registered successfully.`);
            await unlinkAsync(filePath);
            res.redirect('/api/students/register');
    
        } catch (error) {
            console.error('Error in upload registration:', error);
            req.flash('error', 'An error occurred during registration.');
            res.redirect('/api/students/register');
        }
    }
    
    // Helper function to parse CSV
    function parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const students = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    // Map CSV columns to student fields
                    const student = {
                        name: row.name,
                        email: row.email,
                        enrollment_number: row.enrollment_number,
                        class_name: row.class_name,
                        section: row.section,
                        semester: parseInt(row.semester, 10)
                        // Add other fields if necessary
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
            // Add other fields if necessary
        }));
    
        return students;
    }
