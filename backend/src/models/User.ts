import mongoose, { Document, Schema, Model } from 'mongoose';

export type UserRole = 'ADMIN' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  employeeId: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false // Excluded from default queries for security
    },
    role: {
      type: String,
      enum: ['ADMIN', 'GENERAL_USER'],
      default: 'GENERAL_USER',
      required: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
