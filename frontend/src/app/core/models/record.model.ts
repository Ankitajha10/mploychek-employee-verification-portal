export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'IN_REVIEW' | 'REJECTED';

export interface PopulatedUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  employeeId: string;
  department: string;
}

export interface EmploymentRecord {
  _id: string;
  userId: string | PopulatedUser;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecordRequest {
  userId?: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string;
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
}
