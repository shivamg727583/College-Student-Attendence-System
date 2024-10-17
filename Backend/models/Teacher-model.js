const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

// Teaching Schedule Schema
const TeachingScheduleSchema = new Schema({
    subjectId: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    classId: {
        type: Schema.Types.ObjectId, // Class ID added for easier reference
        ref: 'Class',                // Reference to the Class model
        
    },
    class_name:{
        type:String,
        required:true
    },
    section: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    }
}, { _id: false }); // Prevent creating a separate _id for each schedule entry

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

    teachingSchedule: [TeachingScheduleSchema] // Change to include teachingSchedule
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
      
        teachingSchedule: Joi.array().items(
            Joi.object({
                subjectId: Joi.string().custom(objectId).required().messages({
                    'any.invalid': 'Invalid Subject ID',
                    'any.required': 'Subject ID is required'
                }),
                class_name: Joi.string().trim().required().messages({
                    'string.empty': 'Class is required',
                    'any.required': 'Class is required'
                }),
                section: Joi.string().trim().required().messages({
                    'string.empty': 'Section is required',
                    'any.required': 'Section is required'
                }),
                semester: Joi.string().trim().required().messages({
                    'string.empty': 'Semester is required',
                    'any.required': 'Semester is required'
                })
            })
        ).required().messages({
            'array.base': 'Teaching schedule should be an array',
            'any.required': 'Teaching schedule is required'
        })
    })
    

// Export both the Teacher model and the validation schema
module.exports = {
    TeacherModel: mongoose.model('Teacher', TeacherSchema),
    validateTeacher: (data) => teacherValidationSchema.validate(data)
};
