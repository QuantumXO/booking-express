import { Router } from 'express';
import { slotsController } from './slots.controller';

const router = Router();

router.get('/', slotsController.getSlots);

export { router as slotsRouter };
