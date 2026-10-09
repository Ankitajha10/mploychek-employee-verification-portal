import { Request, Response, NextFunction } from 'express';
import { RecordService } from '../services/record.service';

export class RecordController {
  public static async getRecords(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const userIdFilter = req.query.userId as string | undefined;
      const records = await RecordService.getRecords(req.user, userIdFilter);

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getRecordById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const record = await RecordService.getRecordById(req.params.id, req.user);

      res.status(200).json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { company, position, employmentType, startDate, endDate, verificationNotes, userId } = req.body;

      if (!company || !position || !startDate) {
        res.status(400).json({
          success: false,
          message: 'Company, position, and start date are required.'
        });
        return;
      }

      const newRecord = await RecordService.createRecord(
        {
          company,
          position,
          employmentType,
          startDate,
          endDate,
          verificationNotes,
          userId
        },
        req.user
      );

      res.status(201).json({
        success: true,
        message: 'Employment record created successfully',
        data: newRecord
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const updatedRecord = await RecordService.updateRecord(
        req.params.id,
        req.body,
        req.user
      );

      res.status(200).json({
        success: true,
        message: 'Employment record updated successfully',
        data: updatedRecord
      });
    } catch (error) {
      next(error);
    }
  }
}
