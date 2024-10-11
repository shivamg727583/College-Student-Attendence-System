const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Subject Schema
const SubjectSchema = new Schema({
 subject_name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true,
        unique: true // Ensures each subject has a unique name
    },
    subject_code: {
        type: String,
        required: [true, 'Subject code is required'],
        trim: true,
        unique: true // Subject code should also be unique
    },
   
}, { 
    timestamps: true 
});


const subjectValidationSchema = Joi.object({
    subject_name: Joi.string().trim().required().messages({
        'string.empty': 'Subject name is required',
        'any.required': 'Subject name is required'
    }),
    subject_code: Joi.string().trim().required().messages({
        'string.empty': 'Subject code is required',
        'any.required': 'Subject code is required'
    }),
   
});

// Export both the Subject model and validation schema
module.exports = {
    SubjectModel: mongoose.model('Subject', SubjectSchema),
    validateSubject: (data) => subjectValidationSchema.validate(data)
};
