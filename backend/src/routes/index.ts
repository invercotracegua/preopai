import { Router } from 'express';
import auth from './modules/auth.js';
import companies from './modules/companies.js';
import vehicles from './modules/vehicles.js';
import wallet from './modules/wallet.js';
import billing from './modules/billing.js';
import media from './modules/media.js';
import reviews from './modules/reviews.js';

const r = Router();
r.use('/auth', auth);
r.use('/companies', companies);
r.use('/vehicles', vehicles);
r.use('/wallet', wallet);
r.use('/billing', billing);
r.use('/media', media);
r.use('/reviews', reviews);
export default r;
