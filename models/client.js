const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

// Define the form schema
const ClientSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: () => shortid.generate(), // Generate a unique ID using nanoid
    },
    domain: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type: String,
        required: true,
        
    },
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        
        validate: {
            validator: (v) => {
                // Simple email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    username: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    submissionDate: {
        type: String,
        
    },
});

// Middleware to hash password before saving the form
ClientSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Create the Form model
const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
