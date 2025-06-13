import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['web-development', 'mobile-development', 'consulting', 'design', 'marketing', 'other']
  },
  features: [{
    type: String
  }],
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'monthly', 'yearly', 'custom', 'contact'],
      default: 'contact'
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly', 'hourly'],
      default: 'one-time'
    }
  },
  images: [{
    type: String
  }],
  caseStudies: [{
    title: String,
    description: String,
    clientName: String,
    results: String,
    image: String,
    link: String
  }],
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

export default mongoose.model('Service', serviceSchema);
