import { HydratedDocument, InferSchemaType, Model, model, models, Schema } from 'mongoose';

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

export type Slot = InferSchemaType<typeof slotSchema>;
export type SlotDocument = HydratedDocument<Slot>;

export const SlotModel =
  (models.Slot as Model<Slot> | undefined) ?? model<Slot>('Slot', slotSchema, 'slots');
