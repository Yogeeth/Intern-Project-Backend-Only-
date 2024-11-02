const express = require('express');
const Client = require('../models/client'); 



// Create a router
const router = express.Router();

  







router.post('/client', async (req, res) => {
    try {
        const { domain, logo, heading, email, username, password } = req.body;
        console.log(req.body,domain,logo,heading, email, username, password);
        const newForm = new Client({
            domain,
            logo,
            heading,
            email,
            username,
            password 
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
router.get('/client', async (req, res) => {
    
    try {
        const forms = await Client.find();
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
router.get('/client/:code', async (req, res) => {
    const { code } = req.params;

    try {
        
        const client = await Client.findOne({ code });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        
        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving client data',
            error: error.message
        });
    }
});

router.get('/clients-per-year', async (req, res) => {
    try {
      const clientsPerYear = await Client.aggregate([
        {
          $group: {
            _id: { $year: { $toDate: "$submissionDate" } }, 
            count: { $sum: 1 } 
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      res.status(200).json(clientsPerYear);
    } catch (error) {
      console.error('Error calculating clients per year:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/clients-per-month', async (req, res) => {
    try {
      const clientsPerMonth = await Client.aggregate([
        {
          $group: {
            _id: { 
              year: { $year: { $toDate: "$submissionDate" } },
              month: { $month: { $toDate: "$submissionDate" } }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);
  
      res.status(200).json(clientsPerMonth);
    } catch (error) {
      console.error('Error calculating clients per month:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
    
      
  
      const deletedDocument = await Client.findByIdAndDelete(id);
  
      if (!deletedDocument) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.status(200).json({ message: 'Document deleted successfully', data: deletedDocument });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;