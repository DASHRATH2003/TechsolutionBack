import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  inquiryType: {
    type: String,
    enum: ['general', 'service-inquiry', 'support', 'partnership', 'career', 'other'],
    default: 'general'
  },
  serviceInterest: {
    type: String,
    enum: ['web-development', 'mobile-development', 'consulting', 'design', 'marketing', 'other']
  },
  budget: {
    type: String,
    enum: ['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', 'over-100k', 'not-specified'],
    default: 'not-specified'
  },
  timeline: {
    type: String,
    enum: ['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'not-specified'],
    default: 'not-specified'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'closed'],
    default: 'new'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  },
  responseDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);
