import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// GET /api/company - Get company information
router.get('/', async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) {
      return res.status(404).json({ message: 'Company information not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company information', error: error.message });
  }
});

// POST /api/company - Create or update company information
router.post('/', async (req, res) => {
  try {
    const existingCompany = await Company.findOne();
    
    if (existingCompany) {
      // Update existing company
      const updatedCompany = await Company.findByIdAndUpdate(
        existingCompany._id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedCompany);
    } else {
      // Create new company
      const company = new Company(req.body);
      const savedCompany = await company.save();
      res.status(201).json(savedCompany);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error saving company information', error: error.message });
  }
});

// PUT /api/company/:id - Update company information
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: 'Error updating company information', error: error.message });
  }
});

// GET /api/company/contact - Get contact information only
router.get('/contact', async (req, res) => {
  try {
    const company = await Company.findOne().select('contact address socialMedia');
    if (!company) {
      return res.status(404).json({ message: 'Contact information not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact information', error: error.message });
  }
});

export default router;
