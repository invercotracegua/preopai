import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const r = Router();

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if(!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  const ok = bcrypt.compareSync(password, user.password);
  if(!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ sub: user.id, role: user.role, companyId: user.companyId, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.json({ token });
});

export default r;
