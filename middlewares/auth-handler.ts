import { Request, Response, NextFunction } from 'express';

export default async function authHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error("Invalid or missing authentication token.");
    }

    next();
    
  } catch(error) {
    next(error);
  }
};