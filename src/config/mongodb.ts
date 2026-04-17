import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectMongo(): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  if (!env.mongodbUri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(env.mongodbUri, { dbName: env.mongodbDbName });

  isConnected = true;

  console.log(`MongoDB connected successfully.`);

  return mongoose;
}

export async function closeMongo(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
