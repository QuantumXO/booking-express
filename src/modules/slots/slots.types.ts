import { Slot } from './slots.models';

export type NewSlot = {
  id: string;
  contractorId: string;
  price?: number;
  startAt: Date;
  endAt: Date;
};

export type SlotFilters = {
  contractorId?: string;
  active?: boolean;
  limit: number;
  page: number;
};

export type FindSlotsParams = {
  contractorId?: string;
  active?: boolean;
  limit: number;
  skip: number;
};

export type FindSlotsResult = {
  slots: Slot[];
  total: number;
};
