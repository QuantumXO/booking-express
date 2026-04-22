import { z } from 'zod';
import { openApiRegistry } from '../../docs/openapi-registry';
import { createSlotSchema, getSlotsQuerySchema, patchSlotSchema } from './slots.validation';
import { PublicUserSchema } from '../users/users.openapi';

const CreateSlotDtoSchema = openApiRegistry.register('CreateSlotDto', createSlotSchema);
const GetSlotsQueryDtoSchema = openApiRegistry.register('GetSlotsQueryDto', getSlotsQuerySchema);
const PatchSlotDtoSchema = openApiRegistry.register('PatchSlotDto', patchSlotSchema);

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

const SlotWithContractorDtoSchema = openApiRegistry.register(
  'SlotWithContractorDto',
  SlotDtoSchema.extend({
    contractor: PublicUserSchema,
  })
);

const SlotsPaginationSchema = openApiRegistry.register(
  'SlotsPaginationDto',
  z.object({
    page: z.number().int().positive().meta({
      example: 1,
    }),
    limit: z.number().int().positive().meta({
      example: 20,
    }),
    total: z.number().int().nonnegative().meta({
      example: 47,
    }),
    pages: z.number().int().nonnegative().meta({
      example: 3,
    }),
  })
);

const SlotListResponseSchema = openApiRegistry.register(
  'SlotListResponse',
  z.object({
    slots: z.array(SlotWithContractorDtoSchema),
    pagination: SlotsPaginationSchema,
  })
);

const ContractorSlotListResponseSchema = openApiRegistry.register(
  'ContractorSlotListResponse',
  z.object({
    slots: z.array(SlotDtoSchema),
  })
);

const PaginatedContractorSlotListResponseSchema = openApiRegistry.register(
  'PaginatedContractorSlotListResponse',
  z.object({
    slots: z.array(SlotDtoSchema),
    pagination: SlotsPaginationSchema,
  })
);

const CreateSlotResponseSchema = openApiRegistry.register(
  'CreateSlotResponse',
  z.object({
    slot: SlotSchema,
  })
);

const PatchSlotResponseSchema = openApiRegistry.register(
  'PatchSlotResponse',
  z.object({
    slot: SlotDtoSchema,
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
  request: {
    query: GetSlotsQueryDtoSchema,
  },
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
  method: 'get',
  path: '/slots/my',
  tags: ['Slots'],
  operationId: 'getContractorSlots',
  security: [{ bearerAuth: [] }],
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: ContractorSlotListResponseSchema,
        },
      },
    },
    '401': {
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
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/slots/{contractorId}',
  tags: ['Slots'],
  operationId: 'getSlotsByContractorId',
  request: {
    query: GetSlotsQueryDtoSchema,
  },
  parameters: [
    {
      name: 'contractorId',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
        example: '0f7fd8de-b2c3-4cc9-9a2a-f09f1d3ef2ef',
      },
    },
  ],
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: PaginatedContractorSlotListResponseSchema,
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

openApiRegistry.registerPath({
  method: 'patch',
  path: '/slots/{slotId}',
  tags: ['Slots'],
  operationId: 'patchSlot',
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
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PatchSlotDtoSchema,
          example: {
            price: 700,
            startAt: '2026-04-22T12:00:00.000Z',
            endAt: '2026-04-22T13:00:00.000Z',
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: PatchSlotResponseSchema,
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
