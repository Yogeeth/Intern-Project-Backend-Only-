const mongoose = require('mongoose');
const shortid = require('shortid');

// Define the form schema
const formSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true, // Generate a short unique ID
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required:true
    },
    submissionDate: {
        type: Date,
        default: Date.now // Sets the default to the current date and time
    },
});

// Create the Form model
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
