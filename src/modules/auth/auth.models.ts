import { InferSchemaType, Schema, model, models } from 'mongoose';

const sessionSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: { type: String, required: false },
    ip: { type: String, required: false },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  {
    versionKey: false,
  },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema>;

export const SessionModel = models.Session || model<SessionDocument>('Session', sessionSchema, 'sessions');
