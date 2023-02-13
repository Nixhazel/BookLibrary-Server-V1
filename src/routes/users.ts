import express from 'express';

import { createUser, getAllUsers, loginUser } from '../controllers/users';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/getAllUsers', auth, getAllUsers);

router.post('/createUser', createUser);
router.post('/login', loginUser);

export default router;
