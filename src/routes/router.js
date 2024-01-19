import { Router, } from 'express';

import { emailController, } from '../controllers/email.controller.js';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({ hello: 'world', });
});

router.post('/email', emailController);

export default router;