import { AuthenticatedRequest } from '../auth/auth.request.types';
import { Response } from 'express';
import { getUser } from '../users/users.helpers';
import { User } from '../users/users.types';
import { bookingService } from './booking.service';
import { BookingDto } from './booking.dto';
import { CreateBookingDto } from './booking.validation';

export const bookingController = {
  async bookSlot(req: AuthenticatedRequest<unknown, unknown, CreateBookingDto>, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const slotId: string = req.body.slotId;
    const booking: BookingDto = await bookingService.bookSlot(actor, slotId);
    res.status(201).json({ booking });
  },
  async getUserBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const bookings: BookingDto[] = await bookingService.getUserBookings(actor);
    res.status(200).json({ bookings });
  },
  async getContractorBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor: User = getUser(req);
    const bookings: BookingDto[] = await bookingService.getContractorBookings(actor);
    res.status(200).json({ bookings });
  },
};
