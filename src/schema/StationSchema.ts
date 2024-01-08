import { Schema } from "mongoose";

export const StationSchema = new Schema({
  stationName: String,
  coordinates: [Number],
  stationId: Number,
  stationDisplay: String,
})