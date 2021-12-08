import express from 'express';

import requireAuth from '../middlewares/requireAuth.js';
import {
  createWallet,
  getWallet,
  transfers,
} from '../controllers/walletController.js';

const router = express.Router();

//* middleware require auth
router.use(requireAuth);

//* URL: /wallets
router.post('/', createWallet);
router.get('/', getWallet);
router.post('/transfers', transfers);

export default router;
