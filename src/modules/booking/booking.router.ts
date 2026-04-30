import { Router } from 'express';
import { requireAuth, requireContractor } from '../../middlewares/auth.middleware';
import { bookingController } from './booking.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { createBookingSchema } from './booking.validation';

export const router = Router();

router.post('/', requireAuth, validateBody(createBookingSchema), bookingController.bookSlot);
router.get('/my', requireAuth, bookingController.getUserBookings);
router.get('/contractor/my', requireAuth, requireContractor, bookingController.getContractorBookings);
router.patch('/:bookingId/cancel', requireAuth, bookingController.cancelBooking);

export { router as bookingRouter };
