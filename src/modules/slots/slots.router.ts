import { Router } from 'express';
import { slotsController } from './slots.controller';
import { requireAuth, requireContractor, requireSystemRole } from '../../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware';
import { createSlotSchema, getSlotsQuerySchema, patchSlotSchema } from './slots.validation';

const router = Router();

// Public
router.get('/', validateQuery(getSlotsQuerySchema), slotsController.getSlots);

// Private
router.get('/my', requireAuth, requireContractor, slotsController.getContractorSlots);
router.post('/', requireAuth, requireSystemRole, validateBody(createSlotSchema), slotsController.createSlot);
router.delete('/:slotId', requireAuth, requireSystemRole, slotsController.deleteSlot);
router.patch('/:slotId', requireAuth, requireSystemRole, validateBody(patchSlotSchema), slotsController.patchSlot);

// Public
router.get('/:contractorId', validateQuery(getSlotsQuerySchema), slotsController.getSlotsByContractorId);

export { router as slotsRouter };
