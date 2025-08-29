import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
  const companyName = process.env.DEFAULT_COMPANY_NAME || 'Empresa Demo';
  let company = await prisma.company.findFirst({ where: { name: companyName } });
  if(!company){
    company = await prisma.company.create({ data: { name: companyName } });
    await prisma.wallet.create({ data: { companyId: company.id } });
    await prisma.priceConfig.create({ data: { companyId: company.id, forType: 'GLOBAL', pricePerReview: Number(process.env.PRICE_PER_REVIEW||3500) } });
  }
  const email = process.env.ADMIN_EMAIL || 'admin@preopai.local';
  const pwd = process.env.ADMIN_PASSWORD || 'Admin123*';
  const password = bcrypt.hashSync(pwd, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if(!existing){
    await prisma.user.create({ data: { email, password, role: 'ADMIN', companyId: company.id } });
  }
  console.log('Seed OK:', { company: company.name, admin: email });
}

main().finally(async()=>prisma.$disconnect());
