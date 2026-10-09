import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';
import { User, IUser } from '../models/User';
import { EmploymentRecord } from '../models/EmploymentRecord';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await EmploymentRecord.deleteMany({});

    console.log('[Seed] Generating hashed passwords...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const userPasswordHash = await bcrypt.hash('User@123', 10);

    console.log('[Seed] Creating demo users...');
    // 1. Admin account
    const adminUser = await User.create({
      name: 'Priya Sharma (Admin)',
      username: 'admin',
      email: 'admin@mploychek.demo',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      department: 'Background Verification Operations',
      employeeId: 'EMP-ADM-001',
      status: 'ACTIVE'
    });

    // 2. General User: Ankita
    const ankitaUser = await User.create({
      name: 'Ankita Verma',
      username: 'ankita',
      email: 'ankita.verma@example.com',
      passwordHash: userPasswordHash,
      role: 'GENERAL_USER',
      department: 'Software Engineering',
      employeeId: 'EMP-ENG-104',
      status: 'ACTIVE'
    });

    // 3. General User: Rahul
    const rahulUser = await User.create({
      name: 'Rahul Mehra',
      username: 'rahul',
      email: 'rahul.mehra@example.com',
      passwordHash: userPasswordHash,
      role: 'GENERAL_USER',
      department: 'Product Management',
      employeeId: 'EMP-PRD-209',
      status: 'ACTIVE'
    });

    // 4. Additional realistic users for admin dashboard pagination and metrics
    const rohitUser = await User.create({
      name: 'Rohit Joshi',
      username: 'rohit',
      email: 'rohit.joshi@example.com',
      passwordHash: userPasswordHash,
      role: 'GENERAL_USER',
      department: 'Quality Assurance',
      employeeId: 'EMP-QA-312',
      status: 'ACTIVE'
    });

    const snehaUser = await User.create({
      name: 'Sneha Patel',
      username: 'sneha',
      email: 'sneha.patel@example.com',
      passwordHash: userPasswordHash,
      role: 'GENERAL_USER',
      department: 'Human Resources',
      employeeId: 'EMP-HR-405',
      status: 'INACTIVE'
    });

    console.log('[Seed] Creating realistic employment records...');

    // Employment records for Ankita
    await EmploymentRecord.create([
      {
        userId: ankitaUser._id,
        company: 'Infosys Limited',
        position: 'Software Engineer',
        employmentType: 'FULL_TIME',
        startDate: '2021-08-01',
        endDate: '2023-11-30',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Official HR employment letter and tax form 16 verified.'
      },
      {
        userId: ankitaUser._id,
        company: 'Zomato Media Pvt Ltd',
        position: 'Frontend Developer Intern',
        employmentType: 'INTERNSHIP',
        startDate: '2021-01-15',
        endDate: '2021-07-15',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Internship completion certificate verified by HR portal.'
      },
      {
        userId: ankitaUser._id,
        company: 'NovaTech Solutions',
        position: 'Senior Frontend Consultant',
        employmentType: 'FULL_TIME',
        startDate: '2023-12-15',
        endDate: 'Present',
        verificationStatus: 'IN_REVIEW',
        verificationNotes: 'Current organization verification request submitted to employer HR.'
      }
    ]);

    // Employment records for Rahul
    await EmploymentRecord.create([
      {
        userId: rahulUser._id,
        company: 'Flipkart Internet Pvt Ltd',
        position: 'Associate Product Manager',
        employmentType: 'FULL_TIME',
        startDate: '2020-06-01',
        endDate: '2022-09-30',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Relieving letter and background check report cleared.'
      },
      {
        userId: rahulUser._id,
        company: 'Swiggy Bundl Technologies',
        position: 'Product Operations Analyst',
        employmentType: 'CONTRACT',
        startDate: '2019-07-01',
        endDate: '2020-05-31',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Contractor agency verification completed.'
      },
      {
        userId: rahulUser._id,
        company: 'FinEdge Global Advisory',
        position: 'Lead Technical PM',
        employmentType: 'FULL_TIME',
        startDate: '2022-11-01',
        endDate: 'Present',
        verificationStatus: 'PENDING',
        verificationNotes: 'Awaiting primary employer authorized signature verification.'
      }
    ]);

    // Employment records for Rohit
    await EmploymentRecord.create([
      {
        userId: rohitUser._id,
        company: 'Wipro Technologies',
        position: 'QA Automation Engineer',
        employmentType: 'FULL_TIME',
        startDate: '2022-03-01',
        endDate: '2024-01-15',
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Experience letter verified.'
      },
      {
        userId: rohitUser._id,
        company: 'TechCrafters Inc',
        position: 'Test Engineer',
        employmentType: 'CONTRACT',
        startDate: '2024-02-01',
        endDate: 'Present',
        verificationStatus: 'REJECTED',
        verificationNotes: 'Mismatch in dates provided versus company records.'
      }
    ]);

    console.log('====================================================');
    console.log(' DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log(' Demo Accounts Created:');
    console.log(' 1. Admin:         admin   / Admin@123 (ADMIN)');
    console.log(' 2. General User:  ankita  / User@123  (GENERAL_USER)');
    console.log(' 3. General User:  rahul   / User@123  (GENERAL_USER)');
    console.log('====================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase();
}
