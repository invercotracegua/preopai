import { Router } from 'express';
import { PrismaClient, TxType } from '@prisma/client';
import { requireAuth } from '../../utils/auth.js';
import { requireCompany } from '../../utils/tenant.js';
const prisma = new PrismaClient();
const r = Router();

// Crea un "checkout" de recarga (placeholder); en PRO, integra Wompi real.
r.post('/topups/create', requireAuth, requireCompany, async (req: any, res) => {
  const { amount } = req.body;
  const fakeCheckoutUrl = `https://checkout.wompi.co/p/?amount=${amount}&ref=${Date.now()}`;
  res.json({ url: fakeCheckoutUrl, note: "Integrar Wompi TEST/PRO según docs/CONFIG_WOMPI.md" });
});

// Webhook (idempotente) - DEMO: simula aprobación y recarga saldo.
r.post('/webhooks/wompi', async (req, res) => {
  // TODO: validar firma (X-Wompi-Signature); ver docs/CONFIG_WOMPI.md
  const { companyId, wompi_id, amount_in_cents } = req.body || {};
  if(!companyId) return res.status(400).json({ error: 'Falta companyId' });
  const wallet = await prisma.wallet.findFirst({ where: { companyId } });
  if(!wallet) return res.status(404).json({ error: 'Wallet no encontrada' });
  await prisma.$transaction(async(tx)=>{
    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: Number(amount_in_cents||0)/100 }}});
    await tx.transaction.create({ data: { walletId: wallet.id, type: 'TOPUP', amount: Number(amount_in_cents||0)/100, currency: 'COP', source: 'WOMPI', wompiId: wompi_id, status: 'APPROVED' }});
  });
  res.json({ ok: true });
});

export default r;
