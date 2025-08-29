import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthedRequest extends Request {
  user?: any;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction){
  const hdr = req.headers.authorization;
  if(!hdr) return res.status(401).json({ error: 'No token' });
  const token = hdr.replace('Bearer ', '');
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload;
    next();
  } catch(err){
    return res.status(401).json({ error: 'Invalid token' });
  }
}
