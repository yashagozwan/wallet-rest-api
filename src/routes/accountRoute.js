import express from 'express';

import requireAuth from '../middlewares/requireAuth.js';
import { getAccount } from '../controllers/accountController.js';

const router = express.Router();

router.use(requireAuth);

//* URL: /account
router.get('/', getAccount);

export default router;
