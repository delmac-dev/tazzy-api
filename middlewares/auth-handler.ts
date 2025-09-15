import { Request, Response, NextFunction } from 'express';
import { client } from '../lib/supabase';

export default async function authHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error("Invalid or missing authentication token.");
    }

    // const { error } = await client(token).auth.getClaims(token);

    // if(error) throw error;

    next();
    
  } catch(error) {
    next(error);
  }
};