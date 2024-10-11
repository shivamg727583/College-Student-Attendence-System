const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Class Subject Schema
const ClassSubjectSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required']
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: false // Make teacher optional
    }
}, { _id: false }); // Prevent creation of _id for subdocuments

// Class Schema
const ClassSchema = new Schema({
    class_name: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true
    },
    section: {
        type: String,
        required: [true, 'Section is required'],
        trim: true
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true,
    },
    subjects: [ClassSubjectSchema], // List of subjects and their respective teachers
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
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

// Class Subject Validation Schema
const classSubjectValidationSchema = Joi.object({
    subject: Joi.string().custom(objectId).required().messages({
        'any.invalid': 'Invalid Subject ID',
        'any.required': 'Subject ID is required'
    }),
    teacher: Joi.string().custom(objectId).optional().allow(null).messages({
        'any.invalid': 'Invalid Teacher ID'
    })
});

// Class Validation Schema
const classValidationSchema = Joi.object({
    class_name: Joi.string().trim().required().messages({
        'string.empty': 'Class name is required',
        'any.required': 'Class name is required'
    }),
    section: Joi.string().trim().required().messages({
        'string.empty': 'Section is required',
        'any.required': 'Section is required'
    }),
    semester: Joi.string().trim().required().messages({
        'string.empty': 'Semester is required',
        'any.required': 'Semester is required'
    }),
    subjects: Joi.array().items(classSubjectValidationSchema).required().messages({
        'array.base': 'Subjects should be an array',
        'any.required': 'Subjects are required'
    }),
    students: Joi.array().items(Joi.string().custom(objectId)).optional()
});

// Export both the Class model and the validation schema
module.exports = {
    ClassModel: mongoose.model('Class', ClassSchema),
    validateClass: (data) => classValidationSchema.validate(data)
};