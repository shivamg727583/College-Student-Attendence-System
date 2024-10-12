const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Attendance Schema
const AttendanceSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student reference is required']
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class reference is required']
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required']
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher reference is required']
    },
    date: {
        type: Date,
        required: [true, 'Date of attendance is required'],
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: [true, 'Attendance status is required']
    },
   
}, { 
    timestamps: true 
});

// Compound Index to prevent duplicate attendance records for the same student, class, subject, and date
AttendanceSchema.index({ student: 1, class: 1, subject: 1, date: 1 }, { unique: true });

// Validation for ObjectId
const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

// Attendance Validation Schema
const attendanceValidationSchema = Joi.object({
    student: Joi.string().custom(objectId).required().messages({
        'string.empty': 'Student ID is required',
        'any.required': 'Student ID is required',
        'any.invalid': 'Invalid Student ID'
    }),
    class: Joi.string().custom(objectId).required().messages({
        'string.empty': 'Class ID is required',
        'any.required': 'Class ID is required',
        'any.invalid': 'Invalid Class ID'
    }),
    subject: Joi.string().custom(objectId).required().messages({
        'string.empty': 'Subject ID is required',
        'any.required': 'Subject ID is required',
        'any.invalid': 'Invalid Subject ID'
    }),
    teacher: Joi.string().custom(objectId).required().messages({
        'string.empty': 'Teacher ID is required',
        'any.required': 'Teacher ID is required',
        'any.invalid': 'Invalid Teacher ID'
    }),
    date: Joi.date().required().messages({
        'date.base': 'Date must be a valid date',
        'any.required': 'Date is required'
    }),
    status: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required().messages({
        'any.only': 'Status must be one of Present, Absent, Late, Excused',
        'any.required': 'Status is required'
    }),

});

// Export both the Attendance model and the validation schema
module.exports = {
    AttendanceModel: mongoose.model('Attendance', AttendanceSchema),
    validateAttendance: (data) => attendanceValidationSchema.validate(data)
};
