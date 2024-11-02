const express = require('express');
const Formify = require('../models/formify');
const router = express.Router();

router.post('/formify', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        const newForm = new Formify({

            email
// Will be hashed in the model's pre-save middleware
        });

        const savedForm = await newForm.save();
        res.status(201).json({
            success: true,
            message: 'Form created successfully',
            data: savedForm
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating form',
            error: error.message
        });
    }
});

// GET route to retrieve all form entries
router.get('/formify', async (req, res) => {
    try {
        const forms = await Formify.find();
        res.status(200).json({
            success: true,
            data: forms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving forms',
            error: error.message
        });
    }
});

module.exports = router;