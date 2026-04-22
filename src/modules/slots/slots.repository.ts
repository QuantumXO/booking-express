import { SlotDocument, SlotModel } from './slots.models';
import { FindSlotsParams, FindSlotsResult, NewSlot, Slot } from './slots.types';

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
  async findMany(params: FindSlotsParams): Promise<FindSlotsResult> {
    const query: Record<string, unknown> = {};

    if (params.contractorId) {
      query.contractorId = params.contractorId;
    }

    if (params.active === true) {
      query.endAt = { $gt: new Date() };
    }

    if (params.active === false) {
      query.endAt = { $lte: new Date() };
    }

    const [slotDocuments, total] = await Promise.all([
      SlotModel.find(query).sort({ startAt: 1 }).skip(params.skip).limit(params.limit).lean(),
      SlotModel.countDocuments(query),
    ]);

    return {
      slots: slotDocuments,
      total,
    };
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
    excludeSlotId?: string;
  }): Promise<SlotDocument | null> {
    const query: Record<string, unknown> = {
      contractorId: params.contractorId,
      startAt: { $lt: params.endAt },
      endAt: { $gt: params.startAt },
    };

    if (params.excludeSlotId) {
      query._id = { $ne: params.excludeSlotId };
    }

    return SlotModel.findOne(query).lean();
  },
  async deleteSlot(slotId: string): Promise<void> {
    await SlotModel.deleteOne({ _id: slotId });
  },
  async findByContractorId(contractorId: string): Promise<SlotDocument[] | null> {
    return SlotModel.find({ contractorId }).lean();
  },
  async patchSlot(slotId: string, updates: { price?: number; startAt?: Date; endAt?: Date }): Promise<SlotDocument | null> {
    return SlotModel.findByIdAndUpdate(slotId, { $set: updates }, { new: true }).lean();
  },
};
