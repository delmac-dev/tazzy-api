import { Request, Response, NextFunction } from 'express';
import { client } from '../lib/supabase';

const authFailResponse = {
  error: "Unauthorized", 
  message: "Invalid or missing authentication token."
}

export default async function authHandler(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json(authFailResponse);
  
  const { data, error } = await client(token).auth.getClaims(token);
  
  if(error) return res.status(401).json(authFailResponse);

  next();
};