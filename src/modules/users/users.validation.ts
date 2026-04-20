import { z } from 'zod';

export const blockUserSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(1, 'Reason must not be empty')
      .max(255, 'Reason must be at most 255 characters')
      .nullable()
      .optional(),
  })
  .meta({
    description: 'Payload for blocking a user',
  })
  .strict();

export type BlockUserDto = z.infer<typeof blockUserSchema>;
