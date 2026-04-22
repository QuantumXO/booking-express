import { slotsRepository } from './slots.repository';
import {
  ContractorSlotListDto,
  SlotDto,
  SlotListDto,
  SlotWithContractorDto,
  toSlotDto,
  toSlotWithContractorDto,
} from './slots.dto';
import { SlotDocument } from './slots.models';
import { usersRepository } from '../users/users.repository';
import { ApiError } from '../../utils/api-error';
import { PublicUserDto, toPublicUserDto } from '../users/users.dto';
import { CreateSlotDto, PatchSlotDto } from './slots.validation';
import { FindSlotsParams, FindSlotsResult, NewSlot, Slot, SlotFilters } from './slots.types';
import { User, UserRoles } from '../users/users.types';

export const slotsService = {
  async getSlots(filters: SlotFilters): Promise<SlotListDto> {
    const skip = (filters.page - 1) * filters.limit;

    const params: FindSlotsParams = {
      contractorId: filters.contractorId,
      active: filters.active,
      limit: filters.limit,
      skip,
    };

    const result: FindSlotsResult = await slotsRepository.findMany(params);
    const contractorIds = [...new Set(result.slots.map((slot: SlotDocument) => slot.contractorId))];
    const contractors = await usersRepository.findByIds(contractorIds);
    const contractorsById = new Map(
      contractors.map((contractor): [string, PublicUserDto] => [contractor.id, toPublicUserDto(contractor)]),
    );

    const slots: SlotWithContractorDto[] = result.slots.map((slot: SlotDocument): SlotWithContractorDto => {
      const contractor: PublicUserDto | undefined = contractorsById.get(slot.contractorId);
      if (!contractor) throw ApiError.notFound(`Contractor not found for slot ${slot._id}`);
      return toSlotWithContractorDto(slot, contractor);
    });

    return {
      slots,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        pages: Math.ceil(result.total / filters.limit),
      },
    };
  },
  async getSlotsByContractorId(filters: SlotFilters): Promise<ContractorSlotListDto> {
    const skip = (filters.page - 1) * filters.limit;

    const params: FindSlotsParams = {
      contractorId: filters.contractorId,
      active: filters.active,
      limit: filters.limit,
      skip,
    };

    const result: FindSlotsResult = await slotsRepository.findMany(params);
    const slots: SlotDto[] = result.slots.map((slot: SlotDocument): SlotDto => toSlotDto(slot));

    return {
      slots,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        pages: Math.ceil(result.total / filters.limit),
      },
    };
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
    if (slot.booked) throw ApiError.conflict('You cannot delete booked slot');

    const isActorAdmin: boolean = actor.roles.includes(UserRoles.ADMIN);

    if (!isActorAdmin && actor.id !== slot.contractorId) {
      throw ApiError.forbidden("You cannot delete someone else's slot");
    }

    await slotsRepository.deleteSlot(slotId);
  },
  async getContractorSlots(contractorId: string): Promise<SlotDto[]> {
    const slots: SlotDocument[] | null = await slotsRepository.findByContractorId(contractorId);
    if (!slots) return [];
    return slots.map((slot): SlotDto => toSlotDto(slot));
  },
  async patchSlot(actor: User, slotId: string, body: PatchSlotDto): Promise<SlotDto> {
    const slot: SlotDocument | null = await slotsRepository.findById(slotId);
    if (!slot) throw ApiError.notFound('Slot not found');
    if (slot.booked) throw ApiError.conflict('You cannot update booked slot');

    const isActorAdmin: boolean = actor.roles.includes(UserRoles.ADMIN);

    if (!isActorAdmin && actor.id !== slot.contractorId) {
      throw ApiError.forbidden("You cannot update someone else's slot");
    }

    const nextStartAt: Date = body.startAt ?? slot.startAt;
    const nextEndAt: Date = body.endAt ?? slot.endAt;

    if (nextEndAt <= nextStartAt) {
      throw ApiError.badRequest('End time must be later than start time');
    }

    const conflictingSlot = await slotsRepository.findOverlappingSlot({
      contractorId: slot.contractorId,
      startAt: nextStartAt,
      endAt: nextEndAt,
      excludeSlotId: slotId,
    });

    if (conflictingSlot) throw ApiError.conflict('There is already a slot in this time range');

    const patchedSlot: SlotDocument | null = await slotsRepository.patchSlot(slotId, {
      price: body.price,
      startAt: body.startAt,
      endAt: body.endAt,
    });

    if (!patchedSlot) throw ApiError.notFound('Slot not found');

    return toSlotDto(patchedSlot);
  },
};
