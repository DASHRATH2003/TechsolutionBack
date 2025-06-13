import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  mission: {
    type: String,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  values: [{
    title: String,
    description: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  heroImage: {
    type: String,
    default: ''
  },
  heroVideo: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    businessHours: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', companySchema);
