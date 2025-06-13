import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';
import Service from './models/Service.js';
import TeamMember from './models/TeamMember.js';
import BlogPost from './models/BlogPost.js';
import Testimonial from './models/Testimonial.js';
import Career from './models/Career.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Company.deleteMany({});
    await Service.deleteMany({});
    await TeamMember.deleteMany({});
    await BlogPost.deleteMany({});
    await Testimonial.deleteMany({});
    await Career.deleteMany({});

    // Seed Company Information
    const company = new Company({
      name: 'TechSolutions Inc.',
      tagline: 'Innovative Solutions for Modern Businesses',
      mission: 'To empower businesses with cutting-edge technology solutions that drive growth and success.',
      vision: 'To be the leading provider of innovative technology solutions that transform how businesses operate.',
      story: 'Founded in 2019, TechSolutions Inc. started as a small team of passionate developers with a vision to help businesses leverage technology for growth. Today, we serve clients worldwide with our comprehensive suite of services.',
      values: [
        {
          title: 'Innovation',
          description: 'We constantly push the boundaries of what\'s possible with technology.'
        },
        {
          title: 'Quality',
          description: 'We deliver exceptional quality in everything we do.'
        },
        {
          title: 'Integrity',
          description: 'We conduct business with honesty and transparency.'
        },
        {
          title: 'Collaboration',
          description: 'We work closely with our clients to achieve their goals.'
        }
      ],
      achievements: [
        {
          title: 'Company Founded',
          description: 'Started our journey with a vision to transform businesses through technology.',
          date: new Date('2019-01-01')
        },
        {
          title: '100+ Projects Completed',
          description: 'Reached the milestone of completing over 100 successful projects.',
          date: new Date('2023-06-01')
        }
      ],
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'info@techsolutions.com',
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM PST'
      },
      socialMedia: {
        facebook: 'https://facebook.com/techsolutions',
        twitter: 'https://twitter.com/techsolutions',
        linkedin: 'https://linkedin.com/company/techsolutions',
        instagram: 'https://instagram.com/techsolutions'
      }
    });
    await company.save();

    // Seed Team Members
    const teamMembers = [
      {
        name: 'John Smith',
        position: 'CEO & Founder',
        bio: 'John is a visionary leader with over 15 years of experience in technology and business development.',
        email: 'john@techsolutions.com',
        skills: ['Leadership', 'Strategy', 'Business Development'],
        experience: 15,
        isLeadership: true,
        order: 1
      },
      {
        name: 'Sarah Johnson',
        position: 'CTO',
        bio: 'Sarah leads our technical team with expertise in full-stack development and system architecture.',
        email: 'sarah@techsolutions.com',
        skills: ['Full-Stack Development', 'System Architecture', 'Team Leadership'],
        experience: 12,
        isLeadership: true,
        order: 2
      },
      {
        name: 'Mike Chen',
        position: 'Lead Developer',
        bio: 'Mike is a passionate developer specializing in modern web technologies and mobile applications.',
        email: 'mike@techsolutions.com',
        skills: ['React', 'Node.js', 'Mobile Development'],
        experience: 8,
        isLeadership: false,
        order: 3
      }
    ];

    const savedTeamMembers = await TeamMember.insertMany(teamMembers);

    // Seed Services
    const services = [
      {
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies to meet your business needs.',
        shortDescription: 'Modern, responsive websites and web applications.',
        category: 'web-development',
        features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimization', 'Performance Optimization'],
        pricing: {
          type: 'custom',
          amount: 0
        },
        isActive: true,
        order: 1
      },
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android.',
        shortDescription: 'iOS and Android mobile applications.',
        category: 'mobile-development',
        features: ['Native Development', 'Cross-Platform', 'App Store Deployment', 'Push Notifications'],
        pricing: {
          type: 'custom',
          amount: 0
        },
        isActive: true,
        order: 2
      },
      {
        title: 'UI/UX Design',
        description: 'User-centered design solutions that create engaging and intuitive experiences.',
        shortDescription: 'Beautiful and intuitive user interfaces.',
        category: 'design',
        features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
        pricing: {
          type: 'hourly',
          amount: 75,
          period: 'hourly'
        },
        isActive: true,
        order: 3
      },
      {
        title: 'Digital Marketing',
        description: 'Comprehensive digital marketing strategies to grow your online presence.',
        shortDescription: 'SEO, social media, and digital advertising.',
        category: 'marketing',
        features: ['SEO', 'Social Media Marketing', 'PPC Advertising', 'Content Marketing'],
        pricing: {
          type: 'monthly',
          amount: 2500,
          period: 'monthly'
        },
        isActive: true,
        order: 4
      }
    ];

    await Service.insertMany(services);

    // Seed Testimonials
    const testimonials = [
      {
        clientName: 'Emily Davis',
        clientPosition: 'Marketing Director',
        companyName: 'GrowthCorp',
        testimonial: 'TechSolutions delivered an exceptional website that exceeded our expectations. Their team was professional, responsive, and delivered on time.',
        rating: 5,
        projectType: 'web-development',
        isFeatured: true,
        isActive: true,
        order: 1
      },
      {
        clientName: 'Robert Wilson',
        clientPosition: 'CEO',
        companyName: 'StartupXYZ',
        testimonial: 'The mobile app they developed for us has been a game-changer for our business. Highly recommend their services!',
        rating: 5,
        projectType: 'mobile-development',
        isFeatured: true,
        isActive: true,
        order: 2
      },
      {
        clientName: 'Lisa Brown',
        clientPosition: 'Product Manager',
        companyName: 'InnovateTech',
        testimonial: 'Outstanding design work! They really understood our brand and created a beautiful, user-friendly interface.',
        rating: 5,
        projectType: 'design',
        isFeatured: true,
        isActive: true,
        order: 3
      }
    ];

    await Testimonial.insertMany(testimonials);

    // Seed Career Positions
    const careers = [
      {
        title: 'Senior Full-Stack Developer',
        department: 'engineering',
        location: 'San Francisco, CA (Remote)',
        type: 'full-time',
        experience: '5-10-years',
        description: 'We are looking for a senior full-stack developer to join our growing team.',
        responsibilities: [
          'Develop and maintain web applications',
          'Collaborate with design and product teams',
          'Mentor junior developers',
          'Participate in code reviews'
        ],
        requirements: [
          '5+ years of full-stack development experience',
          'Proficiency in React and Node.js',
          'Experience with databases (MongoDB, PostgreSQL)',
          'Strong problem-solving skills'
        ],
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
        salary: {
          min: 120000,
          max: 160000,
          currency: 'USD',
          period: 'yearly'
        },
        benefits: ['Health Insurance', '401k', 'Flexible PTO', 'Remote Work'],
        isActive: true
      }
    ];

    await Career.insertMany(careers);

    // Seed Blog Posts
    const blogPosts = [
      {
        title: 'The Future of Web Development',
        slug: 'future-of-web-development',
        excerpt: 'Exploring the latest trends and technologies shaping the future of web development.',
        content: '<p>Web development is constantly evolving, with new technologies and frameworks emerging regularly. In this post, we explore the key trends that will shape the future of web development.</p><h2>Key Trends</h2><ul><li>Progressive Web Apps</li><li>Serverless Architecture</li><li>AI Integration</li><li>WebAssembly</li></ul>',
        author: savedTeamMembers[1]._id, // Sarah Johnson (CTO)
        category: 'technology',
        tags: ['web development', 'technology', 'trends'],
        isPublished: true,
        publishDate: new Date(),
        readTime: 5
      }
    ];

    await BlogPost.insertMany(blogPosts);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
