import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { authController } from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
