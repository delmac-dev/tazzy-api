import { Request, Response, NextFunction } from 'express';
import { client } from '../lib/supabase';

const authFailResponse = {
  error: "Unauthorized", 
  message: "Invalid or missing authentication token."
}

export default async function authHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json(authFailResponse);
    
    const { error } = await client(token).auth.getClaims(token);

    if(error) throw error;

    next();

  }catch(error) {
    res.status(400).json(error);
  }
};