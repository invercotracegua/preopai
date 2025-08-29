import { Router } from 'express';
import { PrismaClient, TxType } from '@prisma/client';
import { requireAuth } from '../../utils/auth.js';
import { requireCompany } from '../../utils/tenant.js';
const prisma = new PrismaClient();
const r = Router();

async function resolvePrice(companyId: string, vehicleId?: string){
  // Vehicle override
  if(vehicleId){
    const vPrice = await prisma.priceConfig.findFirst({ where: { companyId, forType: 'VEHICLE', vehicleId }});
    if(vPrice) return vPrice.pricePerReview;
  }
  // Company global
  const cPrice = await prisma.priceConfig.findFirst({ where: { companyId, forType: 'GLOBAL' }});
  if(cPrice) return cPrice.pricePerReview;
  // Fallback env
  return Number(process.env.PRICE_PER_REVIEW || 3500);
}

r.post('/', requireAuth, requireCompany, async (req: any, res) => {
  const { vehicleId, driverId, notes } = req.body;
  const wallet = await prisma.wallet.findFirst({ where: { companyId: req.companyId }});
  if(!wallet) return res.status(400).json({ error: 'Wallet no encontrada' });
  const price = await resolvePrice(req.companyId, vehicleId);
  if((wallet.balance||0) < price){
    return res.status(402).json({ error: 'Saldo insuficiente', balance: wallet.balance, price });
  }

  const review = await prisma.$transaction(async(tx)=>{
    // crear revisión
    const r = await tx.review.create({ data: { companyId: req.companyId, vehicleId, driverId, notes }});
    // debitar
    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: price }}});
    await tx.transaction.create({ data: { walletId: wallet.id, type: 'DEBIT', amount: price, currency: 'COP', source: 'REVIEW', reviewId: r.id, status: 'APPROVED' }});
    // marcar review con cobro
    await tx.review.update({ where: { id: r.id }, data: { chargedAmount: price, chargeStatus: 'DEBITED' }});
    return r;
  });

  res.json({ ok: true, review, charged: price });
});

export default r;
