import mongoose from 'mongoose';
import { User } from '../users/users.types';
import { ApiError } from '../../utils/api-error';
import { slotsRepository } from '../slots/slots.repository';
import { bookingRepository } from './booking.repository';
import { BookingDto, toBookingDto } from './booking.dto';
import { Booking } from './booking.models';
import { Slot } from '../slots/slots.models';

export const bookingService = {
  async bookSlot(actor: User, slotId: string): Promise<BookingDto> {
    if (actor.blockedAt) throw ApiError.forbidden('Your account is blocked so you can not book slots.');

    const session = await mongoose.startSession();
    let booking: Booking | null = null;

    try {
      await session.withTransaction(async () => {
        const slot: Slot | null = await slotsRepository.bookSlot(slotId, session);
        if (!slot) throw ApiError.conflict('Slot is not available for booking');

        booking = await bookingRepository.create(
          { userId: actor.id, slotId, contractorId: slot.contractorId },
          session,
        );
      });
    } finally {
      await session.endSession();
    }

    if (!booking) throw new Error(`Failed to create booking for slot ${slotId}`);

    return toBookingDto(booking);
  },
  async getUserBookings(actor: User): Promise<BookingDto[]> {
    const bookings: Booking[] = await bookingRepository.findByUserId(actor.id);
    return bookings.map((booking: Booking): BookingDto => toBookingDto(booking));
  },
  async getContractorBookings(actor: User): Promise<BookingDto[]> {
    const bookings: Booking[] = await bookingRepository.findByContractorId(actor.id);
    return bookings.map((booking: Booking): BookingDto => toBookingDto(booking));
  },
};
