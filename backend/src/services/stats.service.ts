import { User } from '../models/User';
import { EmploymentRecord } from '../models/EmploymentRecord';

export interface IDashboardStats {
  totalUsers: number;
  totalGeneralUsers: number;
  totalAdmins: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  inReviewRecords: number;
  rejectedRecords: number;
}

export class StatsService {
  /**
   * Aggregate high-level platform metrics for Admin Dashboard
   */
  public static async getDashboardStats(): Promise<IDashboardStats> {
    const [
      totalUsers,
      totalGeneralUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      totalRecords,
      verifiedRecords,
      pendingRecords,
      inReviewRecords,
      rejectedRecords
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'GENERAL_USER' }),
      User.countDocuments({ role: 'ADMIN' }),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'INACTIVE' }),
      EmploymentRecord.countDocuments(),
      EmploymentRecord.countDocuments({ verificationStatus: 'VERIFIED' }),
      EmploymentRecord.countDocuments({ verificationStatus: 'PENDING' }),
      EmploymentRecord.countDocuments({ verificationStatus: 'IN_REVIEW' }),
      EmploymentRecord.countDocuments({ verificationStatus: 'REJECTED' })
    ]);

    return {
      totalUsers,
      totalGeneralUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      totalRecords,
      verifiedRecords,
      pendingRecords,
      inReviewRecords,
      rejectedRecords
    };
  }
}
