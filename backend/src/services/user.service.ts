import bcrypt from 'bcryptjs';
import { User, IUser, UserRole, UserStatus } from '../models/User';
import { AppError } from '../middleware/error.middleware';

export interface IUserFilterOptions {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ICreateUserDTO {
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  employeeId: string;
  status?: UserStatus;
}

export interface IUpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  employeeId?: string;
  status?: UserStatus;
}

export class UserService {
  /**
   * Fetch all users with optional filtering and search
   */
  public static async getUsers(filters: IUserFilterOptions): Promise<IUser[]> {
    const query: any = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { employeeId: searchRegex }
      ];
    }

    return await User.find(query).sort({ createdAt: -1 });
  }

  /**
   * Fetch single user by ID
   */
  public static async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }

  /**
   * Create a new user with password hashing
   */
  public static async createUser(data: ICreateUserDTO): Promise<IUser> {
    const existingUsername = await User.findOne({ username: data.username.toLowerCase().trim() });
    if (existingUsername) {
      throw new AppError('Username is already taken.', 409);
    }

    const existingEmail = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existingEmail) {
      throw new AppError('Email address is already registered.', 409);
    }

    const existingEmpId = await User.findOne({ employeeId: data.employeeId.trim() });
    if (existingEmpId) {
      throw new AppError('Employee ID already exists.', 409);
    }

    const plainPassword = data.password || 'Welcome@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const newUser = new User({
      name: data.name.trim(),
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role || 'GENERAL_USER',
      department: data.department.trim(),
      employeeId: data.employeeId.trim(),
      status: data.status || 'ACTIVE'
    });

    await newUser.save();
    return newUser;
  }

  /**
   * Update existing user fields
   */
  public static async updateUser(id: string, data: IUpdateUserDTO): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (data.email && data.email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: data.email.toLowerCase() });
      if (existing) {
        throw new AppError('Email address is already in use by another user.', 409);
      }
      user.email = data.email.toLowerCase().trim();
    }

    if (data.name) user.name = data.name.trim();
    if (data.role) user.role = data.role;
    if (data.department) user.department = data.department.trim();
    if (data.employeeId) user.employeeId = data.employeeId.trim();
    if (data.status) user.status = data.status;

    await user.save();
    return user;
  }

  /**
   * Soft deactivation / status toggle to preserve employment history
   */
  public static async toggleUserStatus(id: string, status?: UserStatus): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    user.status = status ? status : user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await user.save();
    return user;
  }

  /**
   * Deactivate user (used by DELETE /api/users/:id)
   */
  public static async deactivateUser(id: string): Promise<IUser> {
    return await this.toggleUserStatus(id, 'INACTIVE');
  }
}
