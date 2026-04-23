export enum BookingStatuses {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export type NewBooking = {
  userId: string;
  slotId: string;
  contractorId: string;
};
