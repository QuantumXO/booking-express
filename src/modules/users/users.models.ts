import { InferSchemaType, Schema, model, models } from 'mongoose';
import { UserRoles, UserStatuses } from './users.types';

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    roles: {
      type: [{ type: String, enum: Object.values(UserRoles) }],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(UserStatuses),
      default: UserStatuses.ACTIVE,
    },

    blockedAt: { type: Date, default: null },
    blockedReason: { type: String, required: false },
    blockedByUserId: { type: String, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const UserModel = models.User || model<UserDocument>('User', userSchema, 'users');
