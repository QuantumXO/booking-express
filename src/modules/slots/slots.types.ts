import { SlotDocument } from './slots.models';

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

export type Slot = {
  id: string;
  contractorId: string;
  price: number | undefined;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type FindSlotsParams = {
  contractorId?: string;
  active?: boolean;
  limit: number;
  skip: number;
};

export type FindSlotsResult = {
  slots: SlotDocument[];
  total: number;
};
