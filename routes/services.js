import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// GET /api/services/:id - Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// POST /api/services - Create new service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
});

// PUT /api/services/:id - Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

// GET /api/services/category/:category - Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services by category', error: error.message });
  }
});

export default router;
