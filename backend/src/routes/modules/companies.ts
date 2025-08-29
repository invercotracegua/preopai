import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../utils/auth.js';
const prisma = new PrismaClient();
const r = Router();

r.get('/', requireAuth, async (req: any, res) => {
  const list = await prisma.company.findMany();
  res.json(list);
});

r.post('/', requireAuth, async (req: any, res) => {
  const { name } = req.body;
  const c = await prisma.company.create({ data: { name } });
  await prisma.wallet.create({ data: { companyId: c.id }});
  res.json(c);
});

export default r;
