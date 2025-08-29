import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { requireAuth } from '../../utils/auth.js';
import { requireCompany } from '../../utils/tenant.js';
const r = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 }});

r.post('/upload', requireAuth, requireCompany, upload.single('image'), async (req: any, res) => {
  if(!req.file) return res.status(400).json({ error: 'No file' });
  const img = sharp(req.file.buffer);
  const meta = await img.metadata();
  const minRes = Number(process.env.AI_MIN_RESOLUTION || 1024);
  const qualityReport:any = { width: meta.width, height: meta.height, passed: true, reasons: [] as string[] };
  if(!meta.width || !meta.height || Math.max(meta.width, meta.height) < minRes){
    qualityReport.passed = false;
    qualityReport.reasons.push(`Resolución insuficiente (< ${minRes}px)`);
  }
  // Nota: Otros chequeos (blur/contraste/duplicados) se implementan en versión avanzada.
  res.json({ quality: qualityReport, meta });
});

export default r;
