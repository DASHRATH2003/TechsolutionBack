import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// GET /api/testimonials - Get all testimonials
router.get('/', async (req, res) => {
  try {
    const { isFeatured, isActive, projectType } = req.query;
    const filter = {};
    
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (projectType) filter.projectType = projectType;
    
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
});

// GET /api/testimonials/:id - Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonial', error: error.message });
  }
});

// POST /api/testimonials - Create new testimonial
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error creating testimonial', error: error.message });
  }
});

// PUT /api/testimonials/:id - Update testimonial
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error updating testimonial', error: error.message });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
});

// GET /api/testimonials/featured - Get featured testimonials
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      isFeatured: true, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured testimonials', error: error.message });
  }
});

export default router;
