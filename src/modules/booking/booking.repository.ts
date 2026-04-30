import { ClientSession } from 'mongoose';
import { BookingStatuses, NewBooking } from './booking.types';
import { Booking, BookingModel } from './booking.models';

export const bookingRepository = {
  async findById(bookingId: string, session?: ClientSession): Promise<Booking | null> {
    return BookingModel.findById(bookingId)
      .session(session ?? null)
      .lean();
  },
  async create(newBooking: NewBooking, session?: ClientSession): Promise<Booking> {
    const booking = new BookingModel({
      _id: crypto.randomUUID(),
      userId: newBooking.userId,
      slotId: newBooking.slotId,
      contractorId: newBooking.contractorId,
    });

    await booking.save({ session });

    const createdBooking: Booking | null = await bookingRepository.findById(booking._id, session);
    if (!createdBooking) throw new Error(`Failed to book ${newBooking.slotId}`);

    return createdBooking;
  },
  async findByUserId(userId: string): Promise<Booking[]> {
    return BookingModel.find({ userId }).lean();
  },
  async findByContractorId(contractorId: string): Promise<Booking[]> {
    return BookingModel.find({ contractorId }).lean();
  },
  async patchStatus(bookingId: string, status: BookingStatuses, session: ClientSession): Promise<Booking | null> {
    return BookingModel.findByIdAndUpdate(bookingId, { $set: { status } }, { new: true, session }).lean();
  },
};
