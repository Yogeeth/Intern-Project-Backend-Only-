const express = require('express');
const Form = require('../models/form'); 
const router = express.Router();
router.post('/form', async (req, res) => {
    
    try {
        const { code,name,email,subject,message } = req.body;
        console.log(req.body)
        
        const form = new Form({code, name, subject, message,email });
        await form.save();

        res.status(201).json({ success: true, form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
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
        
        const result = await Form.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$submissionDate" }, 
                    },
                    totalSubmissions: { $sum: 1 }, 
                },
            },
            {
                $sort: { _id: 1 }, 
            },
        ]);


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
                        year: { $year: "$submissionDate" },  
                        month: { $month: "$submissionDate" }, 
                    },
                    totalSubmissions: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, 
            },
        ]);

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
