import { z } from 'zod';
import { openApiRegistry } from '../../docs/openapi-registry';
import { createSlotSchema } from './slots.validation';
import { PublicUserSchema } from '../users/users.openapi';

const CreateSlotDtoSchema = openApiRegistry.register('CreateSlotDto', createSlotSchema);

const SlotSchema = openApiRegistry.register(
  'Slot',
  z.object({
    id: z.string().uuid().meta({
      example: 'cc995c90-d4c5-4131-8e5a-ea79a18cf6c3',
    }),
    contractorId: z.string().uuid().meta({
      example: '0f7fd8de-b2c3-4cc9-9a2a-f09f1d3ef2ef',
    }),
    price: z.number().positive().optional().meta({
      example: 500,
    }),
    startAt: z.iso.datetime().meta({
      example: '2026-04-22T10:00:00.000Z',
    }),
    endAt: z.iso.datetime().meta({
      example: '2026-04-22T11:00:00.000Z',
    }),
    createdAt: z.iso.datetime().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
    updatedAt: z.iso.datetime().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
  })
);

const SlotDtoSchema = openApiRegistry.register(
  'SlotDto',
  z.object({
    id: z.string().uuid().meta({
      example: 'cc995c90-d4c5-4131-8e5a-ea79a18cf6c3',
    }),
    contractor: PublicUserSchema,
    booked: z.boolean().optional().meta({
      example: false,
    }),
    price: z.number().positive().optional().meta({
      example: 500,
    }),
    startAt: z.iso.datetime().meta({
      example: '2026-04-22T10:00:00.000Z',
    }),
    endAt: z.iso.datetime().meta({
      example: '2026-04-22T11:00:00.000Z',
    }),
    createdAt: z.iso.datetime().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
    updatedAt: z.iso.datetime().optional().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
  })
);

const SlotListResponseSchema = openApiRegistry.register(
  'SlotListResponse',
  z.object({
    slots: z.array(SlotDtoSchema),
  })
);

const CreateSlotResponseSchema = openApiRegistry.register(
  'CreateSlotResponse',
  z.object({
    slot: SlotSchema,
  })
);

const SlotsErrorResponseSchema = openApiRegistry.register(
  'SlotsErrorResponse',
  z.object({
    message: z.string().meta({
      example: 'Slot not found',
    }),
  })
);

openApiRegistry.registerPath({
  method: 'get',
  path: '/slots',
  tags: ['Slots'],
  operationId: 'getSlots',
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: SlotListResponseSchema,
        },
      },
    },
    '404': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: '/slots',
  tags: ['Slots'],
  operationId: 'createSlot',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: CreateSlotDtoSchema,
          example: {
            contractorId: '0f7fd8de-b2c3-4cc9-9a2a-f09f1d3ef2ef',
            price: 500,
            startAt: '2026-04-22T10:00:00.000Z',
            endAt: '2026-04-22T11:00:00.000Z',
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: '',
      content: {
        'application/json': {
          schema: CreateSlotResponseSchema,
        },
      },
    },
    '400': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
    '403': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
    '404': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
    '409': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'delete',
  path: '/slots/{slotId}',
  tags: ['Slots'],
  operationId: 'deleteSlot',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'slotId',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
        example: 'cc995c90-d4c5-4131-8e5a-ea79a18cf6c3',
      },
    },
  ],
  responses: {
    '204': {
      description: '',
    },
    '403': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
    '404': {
      description: '',
      content: {
        'application/json': {
          schema: SlotsErrorResponseSchema,
        },
      },
    },
  },
});
