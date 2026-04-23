import { z } from 'zod';

export const createBookingSchema = z.object({
  slotId: z.uuid(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
