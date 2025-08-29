import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../utils/auth.js';
import { requireCompany } from '../../utils/tenant.js';
const prisma = new PrismaClient();
const r = Router();

r.get('/', requireAuth, requireCompany, async (req: any, res) => {
  const list = await prisma.vehicle.findMany({ where: { companyId: req.companyId }});
  res.json(list);
});

r.post('/', requireAuth, requireCompany, async (req: any, res) => {
  const { plate } = req.body;
  const v = await prisma.vehicle.create({ data: { plate, companyId: req.companyId }});
  res.json(v);
});

export default r;
