import { Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { slotsController } from './slots.controller';
import { requireAuth, requireContractor, requireSystemRole } from '../../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware';
import { createSlotSchema, GetSlotsQueryDto, getSlotsQuerySchema, patchSlotSchema } from './slots.validation';

const router = Router();

// Public
router.get<ParamsDictionary, unknown, unknown, GetSlotsQueryDto>(
  '/',
  validateQuery(getSlotsQuerySchema),
  slotsController.getSlots,
);
router.get<{ contractorId: string }, unknown, unknown, GetSlotsQueryDto>(
  '/:contractorId',
  validateQuery(getSlotsQuerySchema),
  slotsController.getSlotsByContractorId,
);

// Private
router.post('/', requireAuth, requireSystemRole, validateBody(createSlotSchema), slotsController.createSlot);
router.get('/my', requireAuth, requireContractor, slotsController.getContractorSlots);
router.delete('/:slotId', requireAuth, requireSystemRole, slotsController.deleteSlot);
router.patch('/:slotId', requireAuth, requireSystemRole, validateBody(patchSlotSchema), slotsController.patchSlot);

export { router as slotsRouter };
