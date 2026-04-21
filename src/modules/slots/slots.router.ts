import { Router } from 'express';
import { slotsController } from './slots.controller';
import { requireAuth, requireSystemRole } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { createSlotSchema } from './slots.validation';

const router = Router();

router.get('/', slotsController.getSlots);
router.post('/', requireAuth, requireSystemRole, validateBody(createSlotSchema), slotsController.createSlot);
router.delete('/:slotId', requireAuth, requireSystemRole, slotsController.deleteSlot);

export { router as slotsRouter };
