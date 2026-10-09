import { EmploymentRecord, IEmploymentRecord, EmploymentType, VerificationStatus } from '../models/EmploymentRecord';
import { IAuthPayload } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export interface ICreateRecordDTO {
  userId?: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
}

export interface IUpdateRecordDTO {
  company?: string;
  position?: string;
  employmentType?: EmploymentType;
  startDate?: string;
  endDate?: string;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
}

export class RecordService {
  /**
   * Retrieve records strictly based on user role and identity.
   * General Users ONLY receive their own records (enforced at backend database query level).
   * Admins can view all records or filter by user.
   */
  public static async getRecords(
    currentUser: IAuthPayload,
    filterUserId?: string
  ): Promise<IEmploymentRecord[]> {
    const query: any = {};

    if (currentUser.role === 'GENERAL_USER') {
      // Hard backend enforcement: Always restrict to current user's ID
      query.userId = currentUser.id;
    } else if (currentUser.role === 'ADMIN' && filterUserId) {
      query.userId = filterUserId;
    }

    return await EmploymentRecord.find(query)
      .populate('userId', 'name email employeeId department username')
      .sort({ createdAt: -1 });
  }

  /**
   * Fetch single record by ID with role-based access verification
   */
  public static async getRecordById(
    recordId: string,
    currentUser: IAuthPayload
  ): Promise<IEmploymentRecord> {
    const record = await EmploymentRecord.findById(recordId).populate(
      'userId',
      'name email employeeId department username'
    );

    if (!record) {
      throw new AppError('Employment record not found.', 404);
    }

    // Backend access check: General users cannot inspect records belonging to other users
    const recordOwnerId = (record.userId as any)._id
      ? (record.userId as any)._id.toString()
      : record.userId.toString();

    if (currentUser.role === 'GENERAL_USER' && recordOwnerId !== currentUser.id) {
      throw new AppError('Access denied: You are not authorized to view this record.', 403);
    }

    return record;
  }

  /**
   * Create a new employment record
   */
  public static async createRecord(
    data: ICreateRecordDTO,
    currentUser: IAuthPayload
  ): Promise<IEmploymentRecord> {
    // If general user, assign to their own ID. If admin, allow targeting specified user or self
    const targetUserId =
      currentUser.role === 'ADMIN' && data.userId ? data.userId : currentUser.id;

    const newRecord = new EmploymentRecord({
      userId: targetUserId,
      company: data.company.trim(),
      position: data.position.trim(),
      employmentType: data.employmentType || 'FULL_TIME',
      startDate: data.startDate,
      endDate: data.endDate || 'Present',
      verificationStatus:
        currentUser.role === 'ADMIN'
          ? data.verificationStatus || 'VERIFIED'
          : 'PENDING',
      verificationNotes: data.verificationNotes || ''
    });

    await newRecord.save();
    return await newRecord.populate('userId', 'name email employeeId department username');
  }

  /**
   * Update employment record details or verification status
   */
  public static async updateRecord(
    recordId: string,
    data: IUpdateRecordDTO,
    currentUser: IAuthPayload
  ): Promise<IEmploymentRecord> {
    const record = await EmploymentRecord.findById(recordId);

    if (!record) {
      throw new AppError('Employment record not found.', 404);
    }

    // Role check
    if (
      currentUser.role === 'GENERAL_USER' &&
      record.userId.toString() !== currentUser.id
    ) {
      throw new AppError('Access denied: You cannot modify this record.', 403);
    }

    // General users cannot approve/verify their own records
    if (currentUser.role === 'GENERAL_USER' && data.verificationStatus) {
      throw new AppError('Only administrators can update the verification status.', 403);
    }

    if (data.company) record.company = data.company.trim();
    if (data.position) record.position = data.position.trim();
    if (data.employmentType) record.employmentType = data.employmentType;
    if (data.startDate) record.startDate = data.startDate;
    if (data.endDate !== undefined) record.endDate = data.endDate;
    if (data.verificationStatus && currentUser.role === 'ADMIN') {
      record.verificationStatus = data.verificationStatus;
    }
    if (data.verificationNotes !== undefined) {
      record.verificationNotes = data.verificationNotes.trim();
    }

    await record.save();
    return await record.populate('userId', 'name email employeeId department username');
  }
}
