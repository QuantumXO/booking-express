import { InferSchemaType, model, models, Schema } from 'mongoose';

const slotSchema = new Schema(
  {
    _id: { type: String, required: true },
    contractorId: { type: String, required: true },
    booked: { type: Boolean, required: false },
    price: { type: Number, required: false },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type SlotDocument = InferSchemaType<typeof slotSchema>;

export const SlotModel = models.Slot || model<SlotDocument>('Slot', slotSchema, 'slots');
