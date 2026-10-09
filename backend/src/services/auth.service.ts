import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { IAuthPayload } from '../middleware/auth.middleware';

export interface ILoginResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    department: string;
    employeeId: string;
    status: string;
  };
  token: string;
}

export class AuthService {
  /**
   * Authenticate user with username, password, and explicitly requested role
   */
  public static async login(
    username: string,
    password: string,
    requestedRole: UserRole
  ): Promise<ILoginResponse> {
    if (!username || !password || !requestedRole) {
      throw new AppError('Username, password, and role are all required.', 400);
    }

    // Find user by username or email, including passwordHash
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() }
      ]
    }).select('+passwordHash');

    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    if (user.status === 'INACTIVE') {
      throw new AppError('Your account has been deactivated. Please contact an administrator.', 403);
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials.', 401);
    }

    // Explicit Role Check: Selected role must match the actual database role
    if (user.role !== requestedRole) {
      throw new AppError(
        `Role authorization mismatch: Account '${user.username}' is not authorized to log in as '${requestedRole}'.`,
        403
      );
    }

    // Generate JWT token
    const tokenPayload: IAuthPayload = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: (config.jwtExpiresIn || '24h') as any
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        status: user.status
      },
      token
    };
  }

  /**
   * Retrieve current authenticated user profile
   */
  public static async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found.', 404);
    }
    return user;
  }
}
