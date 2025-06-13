import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientPosition: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  testimonial: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  clientImage: {
    type: String,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  projectType: {
    type: String,
    enum: ['web-development', 'mobile-development', 'consulting', 'design', 'marketing', 'other']
  },
  projectValue: {
    type: Number,
    default: 0
  },
  projectDuration: {
    type: String // e.g., "3 months", "6 weeks"
  },
  isVideoTestimonial: {
    type: Boolean,
    default: false
  },
  videoUrl: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Testimonial', testimonialSchema);
