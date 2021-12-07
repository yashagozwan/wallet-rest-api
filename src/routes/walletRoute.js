import express from 'express';

import requireAuth from '../middlewares/requireAuth.js';
import { createWallet, getWallet } from '../controllers/walletController.js';

const router = express.Router();

//* middleware require auth
router.use(requireAuth);

//* URL: /wallets
router.post('/', createWallet);
router.get('/', getWallet);

export default router;
