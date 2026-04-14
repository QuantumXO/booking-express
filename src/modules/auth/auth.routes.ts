import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.schemas';
import { asyncHandler } from '../../utils/async-handler';
import { authController } from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', requireAuth, asyncHandler(authController.me));

export default router;
