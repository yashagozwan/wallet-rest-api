import express from 'express';

import { createUser as signUp } from '../controllers/userController.js';
import { signIn } from '../controllers/authController.js';

const router = express.Router();

//* auth
router.post('/signup', signUp);
router.post('/signin', signIn);

export default router;
