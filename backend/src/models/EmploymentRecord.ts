import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'IN_REVIEW' | 'REJECTED';

export interface IEmploymentRecord extends Document {
  userId: Types.ObjectId;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmploymentRecordSchema = new Schema<IEmploymentRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Job position is required'],
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
      default: 'FULL_TIME',
      required: true
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: String,
      default: 'Present'
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING', 'IN_REVIEW', 'REJECTED'],
      default: 'PENDING',
      required: true
    },
    verificationNotes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const EmploymentRecord: Model<IEmploymentRecord> = mongoose.model<IEmploymentRecord>(
  'EmploymentRecord',
  EmploymentRecordSchema
);
