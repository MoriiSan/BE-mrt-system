import mongoose from "mongoose";
import { StationSchema } from "./schema/StationSchema";
import * as dotenv from 'dotenv';
import { UserSchema } from "./schema/UserSchema";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
let connection: typeof mongoose | null = null;
export const establishConnection = async () => {
  /**
   * create a .env file
   * add a MONGO_URI={connection string} env inside
   */
  connection = await mongoose.connect(MONGO_URI);
  return connection;
}

export const Station = mongoose.model('Station', StationSchema, 'station');
export const User = mongoose.model('User', UserSchema, 'user');