import express from 'express';
import Contact from '../models/Contact.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// GET /api/contact - Get all contact messages (admin)
router.get('/', async (req, res) => {
  try {
    const { status, inquiryType, isRead } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    
    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
  }
});

// GET /api/contact/:id - Get single contact message
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email');
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact message', error: error.message });
  }
});

// POST /api/contact - Create new contact message
router.post('/', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    
    // Here you could add email notification logic
    
    res.status(201).json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      contact: savedContact 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error.message });
  }
});

// PUT /api/contact/:id - Update contact message (admin)
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error updating contact message', error: error.message });
  }
});

// DELETE /api/contact/:id - Delete contact message
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message', error: error.message });
  }
});

// PATCH /api/contact/:id/read - Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Error marking message as read', error: error.message });
  }
});

export default router;
