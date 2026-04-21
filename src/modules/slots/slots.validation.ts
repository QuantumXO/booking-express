import { z } from 'zod';

export const createSlotSchema = z
  .object({
    contractorId: z.uuid('Contractor id must be a valid UUID'),
    price: z.number().positive('Price must be greater than 0').optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: 'End time must be later than start time',
    path: ['endAt'],
  })
  .meta({
    description: 'Payload for creating a slot',
  })
  .strict();

export type CreateSlotDto = z.infer<typeof createSlotSchema>;
