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

export const patchSlotSchema = z
  .object({
    price: z.number().positive('Price must be greater than 0').optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
  .meta({
    description: 'Payload for patching a slot',
  })
  .strict();

export const getSlotsQuerySchema = z.object({
  active: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1),
});

export type CreateSlotDto = z.infer<typeof createSlotSchema>;
export type PatchSlotDto = z.infer<typeof patchSlotSchema>;
export type GetSlotsQueryDto = z.infer<typeof getSlotsQuerySchema>;
