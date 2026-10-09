import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import { EmploymentRecord } from '../src/models/EmploymentRecord';

const TEST_MONGO_URI = 'mongodb://127.0.0.1:27017/mploychek_test_db';

export const setupTestDB = () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_MONGO_URI);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await EmploymentRecord.deleteMany({});

    // Seed test users
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);

    const admin = await User.create({
      name: 'Admin Test',
      username: 'admin',
      email: 'admin@test.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      department: 'Operations',
      employeeId: 'EMP-ADM-TEST',
      status: 'ACTIVE'
    });

    const user = await User.create({
      name: 'Ankita Test',
      username: 'ankita',
      email: 'ankita@test.com',
      passwordHash: userHash,
      role: 'GENERAL_USER',
      department: 'Engineering',
      employeeId: 'EMP-USR-TEST',
      status: 'ACTIVE'
    });

    // Seed test records
    await EmploymentRecord.create({
      userId: user._id,
      company: 'Test Corp A',
      position: 'Developer',
      employmentType: 'FULL_TIME',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      verificationStatus: 'VERIFIED'
    });

    await EmploymentRecord.create({
      userId: admin._id,
      company: 'Admin Corp B',
      position: 'Director',
      employmentType: 'FULL_TIME',
      startDate: '2020-01-01',
      endDate: 'Present',
      verificationStatus: 'VERIFIED'
    });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await EmploymentRecord.deleteMany({});
      await mongoose.disconnect();
    }
  });
};
