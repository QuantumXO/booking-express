import { SlotDocument, SlotModel } from './slots.models';
import { NewSlot, Slot } from './slots.types';

const toSlot = (slot: SlotDocument): Slot => ({
  id: slot._id,
  contractorId: slot.contractorId,
  price: slot.price ?? undefined,
  startAt: slot.startAt,
  endAt: slot.endAt,
  createdAt: slot.createdAt,
  updatedAt: slot.updatedAt,
});

export const slotsRepository = {
  async getSlots(): Promise<SlotDocument[]> {
    return SlotModel.find().lean();
  },
  async findById(slotId: string): Promise<SlotDocument | null> {
    return SlotModel.findById(slotId).lean();
  },
  async create(newSlot: NewSlot): Promise<Slot> {
    await SlotModel.create({
      _id: newSlot.id,
      contractorId: newSlot.contractorId,
      price: newSlot.price,
      startAt: newSlot.startAt,
      endAt: newSlot.endAt,
    });

    const createdSlot: SlotDocument | null = await slotsRepository.findById(newSlot.id);
    if (!createdSlot) throw new Error(`Failed to create slot ${newSlot.id}`);

    return toSlot(createdSlot);
  },
  async findOverlappingSlot(params: {
    contractorId: string;
    startAt: Date;
    endAt: Date;
  }): Promise<SlotDocument | null> {
    return SlotModel.findOne({
      contractorId: params.contractorId,
      startAt: { $lt: params.endAt },
      endAt: { $gt: params.startAt },
    }).lean();
  },
  async deleteSlot(slotId: string): Promise<void> {
    await SlotModel.deleteOne({ _id: slotId });
  },
};
