import mongoose from "mongoose";

const COLLECTION_NAME = 'stations';

const StationSchema = new mongoose.Schema({
    stationName: { type: String, required: true },
    coordinates: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

export const StationModel = mongoose.model('Station', StationSchema, COLLECTION_NAME);

export const getStations = () => StationModel.find();
export const getStationByName = (stationName: String) => StationModel.findOne({ stationName });
export const createStation = (values: Record<string, any>) => new StationModel(values)
    .save().then((station) => station.toObject());
export const deleteStationByName = (stationName: string) => StationModel.findOneAndDelete({ stationName });
export const updateStationByName = (stationName: string, values: Record<string, any>) => StationModel.findOneAndUpdate({ stationName }, values);


