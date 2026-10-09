import { Request, Response, NextFunction } from 'express';

/**
 * Asynchronous Delay Middleware
 * Demonstrates non-blocking async execution using setTimeout wrapped in a Promise.
 * Supports configurable delay via query parameter: ?delay=2000
 * Safely capped at 10,000 milliseconds (10 seconds).
 */
export const asyncDelayMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const delayParam = req.query.delay;

  if (delayParam !== undefined) {
    const parsedDelay = parseInt(String(delayParam), 10);

    if (!isNaN(parsedDelay) && parsedDelay > 0) {
      // Cap the maximum delay at 10 seconds to protect server resources
      const cappedDelay = Math.min(parsedDelay, 10000);
      
      // Genuinely asynchronous, non-blocking delay using event loop timer
      await new Promise((resolve) => setTimeout(resolve, cappedDelay));
    }
  }

  next();
};
