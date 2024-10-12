const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Attendance Record Schema
const AttendanceRecordSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required']
    },
    date: {
        type: Date,
        required: [true, 'Date of attendance is required'],
        validate: {
            validator: function(value) {
                // Ensure the date is not in the future
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                const attendanceDate = new Date(value);
                attendanceDate.setUTCHours(0, 0, 0, 0);
                return attendanceDate <= today;
            },
            message: 'Attendance date cannot be in the future'
        }
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: [true, 'Attendance status is required']
    }
}, { _id: false, timestamps: true  });

const StudentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Student email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    enrollment_number:{
        type: String,
        required: [true, 'Student roll number is required'],
        unique: true,
        trim: true
        },
    
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class reference is required']
    },
    attendance: [AttendanceRecordSchema]
}, { 
    timestamps: true 
});

// Validation for ObjectId
const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

// Attendance Record Validation Schema
const attendanceRecordValidationSchema = Joi.object({
    subject: Joi.string().custom(objectId).required().messages({
        'string.empty': 'Subject ID is required',
        'any.required': 'Subject ID is required',
        'any.invalid': 'Invalid Subject ID'
    }),
    date: Joi.date().max('now').required().messages({
        'date.base': 'Date must be a valid date',
        'date.max': 'Attendance date cannot be in the future',
        'any.required': 'Date is required'
    }),
    status: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required().messages({
        'any.only': 'Status must be one of Present, Absent, Late, Excused',
        'any.required': 'Status is required'
    })
});

// Student Validation Schema
const studentValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Student name is required',
        'any.required': 'Student name is required'
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Student email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Student email is required'
    }),
    enrollment_number: Joi.string().trim().required().messages({
        'string.empty': 'Student enrollment number is required',
        'any.required': 'Student enrollment number is required'
    }),
    // Removed 'class' field
    class_name: Joi.string().trim().required().messages({
        'string.empty': 'Class name is required',
        'any.required': 'Class name is required'
    }),
    section: Joi.string().trim().required().messages({
        'string.empty': 'Section is required',
        'any.required': 'Section is required'
    }),
    semester: Joi.number().integer().min(1).required().messages({
        'number.base': 'Semester must be a number',
        'number.min': 'Semester must be at least 1',
        'any.required': 'Semester is required'
    }),
    attendance: Joi.array().items(attendanceRecordValidationSchema).optional()
});

// Export both the Student model and the validation schemas
module.exports = {
    StudentModel: mongoose.model('Student', StudentSchema),
    validateStudent: (data) => studentValidationSchema.validate(data),
    validateAttendanceRecord: (data) => attendanceRecordValidationSchema.validate(data)
};
