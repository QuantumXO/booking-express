import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../middlewares/auth.middleware';
import { usersController } from './users.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { blockUserSchema } from './users.validation';

export const router = Router();

router.get('/me', requireAuth, usersController.me);

// For admin
router.patch('/:userId/block', requireAuth, requireAdmin, validateBody(blockUserSchema), usersController.blockUser);
router.patch('/:userId/unblock', requireAuth, requireAdmin, usersController.unblockUser);

export { router as usersRouter };
