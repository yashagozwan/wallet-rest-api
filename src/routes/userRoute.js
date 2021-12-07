import express from 'express';

import requireAuth from '../middlewares/requireAuth.js';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

//* middleware require auth
router.use(requireAuth);

//* /users
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

export default router;
