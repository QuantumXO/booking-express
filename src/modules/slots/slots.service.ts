import { slotsRepository } from './slots.repository';
import { SlotDto } from './slots.dto';
import { SlotDocument } from './slots.models';
import { usersRepository } from '../users/users.repository';
import { ApiError } from '../../utils/api-error';
import { PublicUserDto, toPublicUserDto } from '../users/users.dto';

const toSlotDto = (slot: SlotDocument, contractor: PublicUserDto): SlotDto => ({
  contractor,
  booked: slot.booked ?? undefined,
  createdAt: slot.createdAt,
  endAt: slot.endAt,
  id: slot._id,
  price: slot.price ?? undefined,
  startAt: slot.startAt,
  updatedAt: slot.updatedAt ?? undefined,
});

export const slotsService = {
  async getSlots(): Promise<SlotDto[]> {
    const slots: SlotDocument[] = await slotsRepository.getSlots();
    const contractorIds = [...new Set(slots.map((slot) => slot.contractorId))];
    const contractors = await usersRepository.findByIds(contractorIds);
    const contractorsById = new Map(contractors.map((contractor) => [contractor.id, contractor]));

    return slots.map((slot): SlotDto => {
      const contractor = contractorsById.get(slot.contractorId);

      if (!contractor) {
        throw ApiError.notFound(`Contractor not found for slot ${slot._id}`);
      }

      return toSlotDto(slot, toPublicUserDto(contractor));
    });
  },
};
