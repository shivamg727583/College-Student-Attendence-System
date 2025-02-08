const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ClassModel } = require('../models/Class-model');
const { StudentModel, validateStudent } = require('../models/Student-model');
const auth = require('../middlewares/AdminAuth');
const upload = require('../middlewares/upload');
const { RegisterStudents } = require('../controllers/StudentControllers');

// ✅ Register students (upload via CSV/XLSX)
router.post('/register-upload', auth, upload.single('file'), RegisterStudents);

// ✅ Get all students (Pagination optional)
router.get('/', auth, async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error while fetching students.', error: error.message });
    }
});

// ✅ Get student by ID
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid student ID.' });
    }

    try {
        const student = await StudentModel.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Server error while fetching student.', error: error.message });
    }
});

// ✅ Delete student
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid student ID.' });
    }

    try {
        const student = await StudentModel.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        await StudentModel.findByIdAndDelete(id);

        // Remove student from their class
        await ClassModel.findByIdAndUpdate(student.class, { $pull: { students: id } });

        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error while deleting student.', error: error.message });
    }
});

// ✅ Update student
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid student ID.' });
    }

    try {
        const existingStudent = await StudentModel.findById(id);
        if (!existingStudent) return res.status(404).json({ message: 'Student not found.' });

        const updatedStudent = await StudentModel.findByIdAndUpdate(id, updatedData, { new: true });

        // Handle class reassignment if class_name, section, or semester changes
        if (
            existingStudent.class_name !== updatedData.class_name ||
            existingStudent.section !== updatedData.section ||
            existingStudent.semester !== parseInt(updatedData.semester, 10)
        ) {
            await ClassModel.updateOne(
                { class_name: existingStudent.class_name, section: existingStudent.section, semester: existingStudent.semester },
                { $pull: { students: id } }
            );

            await ClassModel.updateOne(
                { class_name: updatedData.class_name, section: updatedData.section, semester: updatedData.semester },
                { $addToSet: { students: id } }
            );
        }

        res.status(200).json({ message: 'Student updated successfully.', student: updatedStudent });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Server error while updating student.', error: error.message });
    }
});

module.exports = router;
