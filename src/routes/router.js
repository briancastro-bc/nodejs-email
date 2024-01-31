import { Router, } from 'express';

import authController from '../controllers/auth.controller.js';
import { emailController, } from '../controllers/email.controller.js';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({ hello: 'world', });
});

router.use('/auth', authController);

router.post('/email', emailController);

export default router;