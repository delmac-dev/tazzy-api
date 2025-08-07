import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { client } from '../lib/supabase';

// const auth = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
//   }) as GetVerificationKey,
//   algorithms: ['ES256'],
//   credentialsRequired: true,
//   requestProperty: 'auth', // -> sets req.auth = decoded JWT payload
// });

const authFailResponse = {
  error: "Unauthorized", 
  message: "Invalid or missing authentication token."
}

export default async function authHandler(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json(authFailResponse);

  
  const { data, error } = await client(token).auth.getClaims(token);
  console.log({data});
  
  if(error) return res.status(401).json(authFailResponse);

  next();
};

// export default function authHandler(req: Request, res: Response, next: NextFunction) {
//   auth(req, res, (err:any) => {
//     // TODO: uncomment this to enable auth
//     // if (err) {
//     //   return res.status(401).json({ error: 'Unauthorized', message: err.message });
//     // }
//     next();
//   });
// }