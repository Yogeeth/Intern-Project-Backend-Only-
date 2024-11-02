const express = require('express');
const Form = require('../models/form'); // Import the Form model

// Create a router
const router = express.Router();

// POST route to create a new form entry
router.post('/form', async (req, res) => {
    
    try {
        const { code,name,email,subject,message } = req.body;
        console.log(req.body)
        
        // Create a new form entry
        const form = new Form({code, name, subject, message,email });
        await form.save();

        res.status(201).json({ success: true, form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET route to retrieve all form entries
router.get('/form/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const forms = await Form.find({code});
        res.status(200).json({ success: true, forms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/form', async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json({ success: true, forms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/submissions-per-month', async (req, res) => {
    try {
        // Aggregating the submissions data by year and month
        const result = await Form.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$submissionDate" }, // Group by year and month
                    },
                    totalSubmissions: { $sum: 1 }, // Count the number of submissions
                },
            },
            {
                $sort: { _id: 1 }, // Sort by month
            },
        ]);

        // Function to format the aggregated data
        

        // Format the result
        

        // Send the formatted result as a response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching submissions data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/submissions-per-year', async (req, res) => {
    try {
        const result = await Form.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$submissionDate" },  // Extract year
                        month: { $month: "$submissionDate" }, // Extract month
                    },
                    totalSubmissions: { $sum: 1 }, // Count the number of submissions
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
            },
        ]);

        // Format the result to include the year and month in the desired format
        const formattedResult = result.map(item => ({
            _id: {
                year: item._id.year,
                month: item._id.month,
            },
            totalSubmissions: item.totalSubmissions,
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
