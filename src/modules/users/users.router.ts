import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { usersController } from './users.controller';

export const router = Router();

router.get('/me', requireAuth, usersController.me);
router.get('/block-user', requireAuth, usersController.blockUser);

export { router as usersRouter };
