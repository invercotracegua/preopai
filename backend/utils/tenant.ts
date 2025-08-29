import { Request, Response, NextFunction } from 'express';

/**
 * Resolve company context either from JWT (preferred) or 'x-company-id' header.
 * Assumes req.user.companyId exists when authenticated.
 */
export function requireCompany(req: any, res: Response, next: NextFunction){
  const userCompany = req.user?.companyId;
  const headerCompany = req.headers['x-company-id'];
  const companyId = userCompany || headerCompany;
  if(!companyId){
    return res.status(400).json({ error: 'Falta companyId (JWT o x-company-id)' });
  }
  req.companyId = Array.isArray(companyId) ? companyId[0] : companyId;
  next();
}
