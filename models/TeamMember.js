import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: {
    type: Number, // years of experience
    default: 0
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  socialMedia: {
    linkedin: String,
    twitter: String,
    github: String
  },
  isLeadership: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('TeamMember', teamMemberSchema);
