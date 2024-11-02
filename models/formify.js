const mongoose = require('mongoose')

const formifySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                // Simple email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    }
})

const Formify = mongoose.model('Formify', formifySchema);

module.exports = Formify;