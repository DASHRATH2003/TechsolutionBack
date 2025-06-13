import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['engineering', 'design', 'marketing', 'sales', 'hr', 'operations', 'management']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
  },
  experience: {
    type: String,
    required: true,
    enum: ['entry-level', '1-3-years', '3-5-years', '5-10-years', '10-plus-years']
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  preferredQualifications: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  benefits: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date
  },
  applicationInstructions: {
    type: String,
    default: 'Please send your resume and cover letter to careers@company.com'
  }
}, {
  timestamps: true
});

export default mongoose.model('Career', careerSchema);
