export type NewSlot = {
  id: string;
  contractorId: string;
  price?: number;
  startAt: Date;
  endAt: Date;
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
