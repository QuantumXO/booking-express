import { HydratedDocument, InferSchemaType, Model, model, models, Schema } from 'mongoose';
import { BookingStatuses } from './booking.types';

const bookingSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    slotId: { type: String, required: true },
    contractorId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatuses),
      required: true,
      default: BookingStatuses.PENDING,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type Booking = InferSchemaType<typeof bookingSchema>;
export type BookingDocument = HydratedDocument<Booking>;

export const BookingModel =
  (models.Booking as Model<Booking> | undefined) ?? model<Booking>('Booking', bookingSchema, 'booking');
