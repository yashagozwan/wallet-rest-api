import express from 'express';

import requireAuth from '../middlewares/requireAuth.js';
import {
  createWallet,
  getWallet,
  transfers,
  mutationIn,
  mutationOut,
  getWalletFromOutSide,
} from '../controllers/walletController.js';

const router = express.Router();

//* middleware require auth
router.use(requireAuth);

//* URL: /wallets
router.post('/', createWallet);
router.get('/', getWallet);
router.post('/get', getWalletFromOutSide);
router.post('/transfers', transfers);
router.get('/mutation/in', mutationIn);
router.get('/mutation/out', mutationOut);

export default router;
