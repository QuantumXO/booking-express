import { slotsRepository } from './slots.repository';
import { SlotDto } from './slots.dto';
import { SlotDocument } from './slots.models';
import { usersRepository } from '../users/users.repository';
import { ApiError } from '../../utils/api-error';
import { PublicUserDto, toPublicUserDto } from '../users/users.dto';
import { CreateSlotDto } from './slots.validation';
import { NewSlot, Slot } from './slots.types';
import { User, UserRoles } from '../users/users.types';

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
  async createSlot(actorUser: User, body: CreateSlotDto): Promise<Slot> {
    const contractor: User | null = await usersRepository.findByIdAndRole(body.contractorId, UserRoles.CONTRACTOR);
    if (!contractor) throw ApiError.notFound('Contractor not found');

    const isActorContractor = actorUser.roles.includes(UserRoles.CONTRACTOR);

    if (isActorContractor && actorUser.id !== contractor.id) {
      throw ApiError.forbidden(`You can't create slot for ${contractor.id}`);
    }

    const conflictingSlot = await slotsRepository.findOverlappingSlot({
      contractorId: body.contractorId,
      startAt: body.startAt,
      endAt: body.endAt,
    });

    if (conflictingSlot) throw ApiError.conflict('There is already a slot in this time range');

    const slot: NewSlot = {
      id: crypto.randomUUID(),
      contractorId: body.contractorId,
      price: body.price,
      startAt: body.startAt,
      endAt: body.endAt,
    };

    return slotsRepository.create(slot);
  },
  async deleteSlot(actor: User, slotId: string): Promise<void> {
    const slot: SlotDocument | null = await slotsRepository.findById(slotId);
    if (!slot) throw ApiError.notFound('Slot not found');

    const isActorAdmin: boolean = actor.roles.includes(UserRoles.ADMIN);

    if (!isActorAdmin && actor.id !== slot.contractorId) {
      throw ApiError.forbidden("You cannot delete someone else's slot");
    }

    await slotsRepository.deleteSlot(slotId);
  },
};
