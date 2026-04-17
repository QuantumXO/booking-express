import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { authController } from './auth.controller';

export const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export { router as authRouter };
