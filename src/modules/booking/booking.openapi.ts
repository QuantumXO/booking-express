import { z } from 'zod';
import { openApiRegistry } from '../../docs/openapi-registry';
import { createBookingSchema } from './booking.validation';
import { BookingStatuses } from './booking.types';

const CreateBookingDtoSchema = openApiRegistry.register('CreateBookingDto', createBookingSchema);

const BookingStatusSchema = z.enum([
  BookingStatuses.PENDING,
  BookingStatuses.CONFIRMED,
  BookingStatuses.CANCELLED,
  BookingStatuses.COMPLETED,
]);

const BookingDtoSchema = openApiRegistry.register(
  'BookingDto',
  z.object({
    id: z.string().uuid().meta({
      example: 'cc995c90-d4c5-4131-8e5a-ea79a18cf6c3',
    }),
    userId: z.string().uuid().meta({
      example: '0f7fd8de-b2c3-4cc9-9a2a-f09f1d3ef2ef',
    }),
    status: BookingStatusSchema.meta({
      example: BookingStatuses.PENDING,
    }),
    createdAt: z.iso.datetime().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
    updatedAt: z.iso.datetime().optional().meta({
      example: '2026-04-21T09:30:00.000Z',
    }),
  }),
);

const CreateBookingResponseSchema = openApiRegistry.register(
  'CreateBookingResponse',
  z.object({
    booking: BookingDtoSchema,
  }),
);

const BookingListResponseSchema = openApiRegistry.register(
  'BookingListResponse',
  z.object({
    bookings: z.array(BookingDtoSchema),
  }),
);

const BookingErrorResponseSchema = openApiRegistry.register(
  'BookingErrorResponse',
  z.object({
    message: z.string().meta({
      example: 'Slot is not available for booking',
    }),
  }),
);

openApiRegistry.registerPath({
  method: 'post',
  path: '/bookings',
  tags: ['Bookings'],
  operationId: 'bookSlot',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: CreateBookingDtoSchema,
          example: {
            slotId: 'cc995c90-d4c5-4131-8e5a-ea79a18cf6c3',
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
          schema: CreateBookingResponseSchema,
        },
      },
    },
    '400': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
    '401': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
    '403': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
    '409': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/bookings/my',
  tags: ['Bookings'],
  operationId: 'getUserBookings',
  security: [{ bearerAuth: [] }],
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: BookingListResponseSchema,
        },
      },
    },
    '401': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/bookings/contractor/my',
  tags: ['Bookings'],
  operationId: 'getContractorBookings',
  security: [{ bearerAuth: [] }],
  responses: {
    '200': {
      description: '',
      content: {
        'application/json': {
          schema: BookingListResponseSchema,
        },
      },
    },
    '401': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
    '403': {
      description: '',
      content: {
        'application/json': {
          schema: BookingErrorResponseSchema,
        },
      },
    },
  },
});
