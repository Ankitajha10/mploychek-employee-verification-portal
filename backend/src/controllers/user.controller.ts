import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UserRole, UserStatus } from '../models/User';

export class UserController {
  public static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const role = req.query.role as UserRole | undefined;
      const status = req.query.status as UserStatus | undefined;

      const users = await UserService.getUsers({ search, role, status });

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, username, email, password, role, department, employeeId, status } = req.body;

      if (!name || !username || !email || !department || !employeeId) {
        res.status(400).json({
          success: false,
          message: 'Name, username, email, department, and employee ID are required.'
        });
        return;
      }

      const newUser = await UserService.createUser({
        name,
        username,
        email,
        password,
        role,
        department,
        employeeId,
        status
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  public static async toggleStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status } = req.body;
      const updatedUser = await UserService.toggleUserStatus(req.params.id, status);

      res.status(200).json({
        success: true,
        message: `User status changed to ${updatedUser.status}`,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Deactivate rather than hard-delete to preserve employment audit history
      const deactivatedUser = await UserService.deactivateUser(req.params.id);

      res.status(200).json({
        success: true,
        message: 'User account successfully deactivated.',
        data: deactivatedUser
      });
    } catch (error) {
      next(error);
    }
  }
}
