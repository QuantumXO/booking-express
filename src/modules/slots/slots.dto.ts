import { SlotDocument } from './slots.models';
import { PublicUserDto } from '../users/users.dto';

export type SlotDto = Omit<SlotDocument, '_id' | 'contractorId'> & {
  id: string;
};

export type SlotWithContractorDto = SlotDto & {
  contractor: PublicUserDto;
};

export type SlotsPaginationDto = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type SlotListDto = {
  slots: SlotWithContractorDto[];
  pagination: SlotsPaginationDto;
};

export type ContractorSlotListDto = {
  slots: SlotDto[];
  pagination: SlotsPaginationDto;
};

export const toSlotDto = (slot: SlotDocument): SlotDto => ({
  booked: slot.booked ?? undefined,
  createdAt: slot.createdAt,
  endAt: slot.endAt,
  id: slot._id,
  price: slot.price ?? undefined,
  startAt: slot.startAt,
  updatedAt: slot.updatedAt ?? undefined,
});

export const toSlotWithContractorDto = (
  slot: SlotDocument,
  contractor: PublicUserDto,
): SlotWithContractorDto => ({
  ...toSlotDto(slot),
  contractor,
});
