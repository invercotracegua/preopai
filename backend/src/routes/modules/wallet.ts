import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../utils/auth.js';
import { requireCompany } from '../../utils/tenant.js';
const prisma = new PrismaClient();
const r = Router();

r.get('/balance', requireAuth, requireCompany, async (req: any, res) => {
  const w = await prisma.wallet.findFirst({ where: { companyId: req.companyId }});
  res.json({ balance: w?.balance ?? 0, currency: w?.currency ?? 'COP' });
});

export default r;
