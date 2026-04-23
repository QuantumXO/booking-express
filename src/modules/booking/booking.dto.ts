import { Booking } from './booking.models';

export type BookingDto = Pick<Booking, 'userId' | 'status' | 'createdAt' | 'updatedAt'> & {
  id: string;
};

export const toBookingDto = (booking: Booking): BookingDto => ({
  userId: booking.userId,
  status: booking.status,
  id: booking._id,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt ?? undefined,
});
