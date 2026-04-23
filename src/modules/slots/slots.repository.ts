import { ClientSession } from 'mongoose';
import { Slot, SlotModel } from './slots.models';
import { FindSlotsParams, FindSlotsResult, NewSlot } from './slots.types';

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
  async findById(slotId: string, session?: ClientSession): Promise<Slot | null> {
    return SlotModel.findById(slotId).session(session ?? null).lean();
  },
  async create(newSlot: NewSlot): Promise<Slot> {
    await SlotModel.create({
      _id: newSlot.id,
      contractorId: newSlot.contractorId,
      price: newSlot.price,
      startAt: newSlot.startAt,
      endAt: newSlot.endAt,
    });

    const createdSlot: Slot | null = await slotsRepository.findById(newSlot.id);
    if (!createdSlot) throw new Error(`Failed to create slot ${newSlot.id}`);

    return createdSlot;
  },
  async findOverlappingSlot(params: {
    contractorId: string;
    startAt: Date;
    endAt: Date;
    excludeSlotId?: string;
  }): Promise<Slot | null> {
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
  async findByContractorId(contractorId: string): Promise<Slot[] | null> {
    return SlotModel.find({ contractorId }).lean();
  },
  async patchSlot(
    slotId: string,
    updates: { price?: number; startAt?: Date; endAt?: Date; booked?: boolean },
  ): Promise<Slot | null> {
    return SlotModel.findByIdAndUpdate(slotId, { $set: updates }, { new: true }).lean();
  },
  async bookSlot(slotId: string, session?: ClientSession): Promise<Slot | null> {
    return SlotModel.findOneAndUpdate(
      {
        _id: slotId,
        booked: { $ne: true },
        startAt: { $gt: new Date() },
      },
      {
        $set: { booked: true },
      },
      { new: true, session },
    ).lean();
  },
};
