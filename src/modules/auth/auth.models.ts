import { InferSchemaType, Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  },
);

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

export type UserDocument = InferSchemaType<typeof userSchema>;
export type SessionDocument = InferSchemaType<typeof sessionSchema>;

export const UserModel = models.User || model<UserDocument>('User', userSchema, 'users');
export const SessionModel = models.Session || model<SessionDocument>('Session', sessionSchema, 'sessions');
