import { SlotDocument, SlotModel } from './slots.models';

export const slotsRepository = {
  async getSlots(): Promise<SlotDocument[]> {
    return SlotModel.find().lean();
  },
};
