const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Teacher Schema
const TeacherSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Teacher name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Teacher email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Teacher password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    }],
    classes: [{
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    }]
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

// Joi Validation Schema
const teacherValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Teacher name is required',
        'any.required': 'Teacher name is required'
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Teacher email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Teacher email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Teacher password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Teacher password is required'
    }),
    subjects: Joi.array().items(Joi.string().custom(objectId)).min(1).required().messages({
        'array.base': 'Subjects must be an array of Subject IDs',
        'array.min': 'At least one subject is required',
        'any.required': 'Subjects are required'
    }),
    classes: Joi.array().items(Joi.string().custom(objectId)).min(1).required().messages({
        'array.base': 'Classes must be an array of Class IDs',
        'array.min': 'At least one class is required',
        'any.required': 'Classes are required'
    })
});

// Export both the Teacher model and the validation schema
module.exports = {
    TeacherModel: mongoose.model('Teacher', TeacherSchema),
    validateTeacher: (data) => teacherValidationSchema.validate(data)
};
