import express from 'express';
import Career from '../models/Career.js';

const router = express.Router();

// GET /api/careers - Get all career positions
router.get('/', async (req, res) => {
  try {
    const { department, type, experience, location, isActive } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (location) filter.location = new RegExp(location, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const careers = await Career.find(filter).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career positions', error: error.message });
  }
});

// GET /api/careers/:id - Get single career position
router.get('/:id', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career position not found' });
    }
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career position', error: error.message });
  }
});

// POST /api/careers - Create new career position
router.post('/', async (req, res) => {
  try {
    const career = new Career(req.body);
    const savedCareer = await career.save();
    res.status(201).json(savedCareer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating career position', error: error.message });
  }
});

// PUT /api/careers/:id - Update career position
router.put('/:id', async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!career) {
      return res.status(404).json({ message: 'Career position not found' });
    }
    
    res.json(career);
  } catch (error) {
    res.status(400).json({ message: 'Error updating career position', error: error.message });
  }
});

// DELETE /api/careers/:id - Delete career position
router.delete('/:id', async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career position not found' });
    }
    res.json({ message: 'Career position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting career position', error: error.message });
  }
});

// GET /api/careers/department/:department - Get positions by department
router.get('/department/:department', async (req, res) => {
  try {
    const careers = await Career.find({ 
      department: req.params.department, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions by department', error: error.message });
  }
});

export default router;
