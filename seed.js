const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const sampleCompanies = [
  {
    companyName: 'TechNova Solutions',
    location: 'Bengaluru',
    industry: 'Software',
    employeeCount: 180,
    email: 'careers@technova.com',
    website: 'https://technova.com',
    contactNumber: '9876543210'
  },
  {
    companyName: 'GreenFuture Labs',
    location: 'Hyderabad',
    industry: 'Renewable Energy',
    employeeCount: 95,
    email: 'info@greenfuture.com',
    website: 'https://greenfuture.com',
    contactNumber: '9123456780'
  },
  {
    companyName: 'CityBridge Logistics',
    location: 'Mumbai',
    industry: 'Logistics',
    employeeCount: 240,
    email: 'ops@citybridge.com',
    website: 'https://citybridge.com',
    contactNumber: '9988776655'
  },
  {
    companyName: 'HealthSphere',
    location: 'Chennai',
    industry: 'Healthcare',
    employeeCount: 120,
    email: 'contact@healthsphere.com',
    website: 'https://healthsphere.com',
    contactNumber: '9012345678'
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Company.deleteMany({});
    await Company.insertMany(sampleCompanies);
    console.log('Sample companies inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seedData();
