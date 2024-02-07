import mongoose from "mongoose";

const COLLECTION_NAME = 'stations';

const StationSchema = new mongoose.Schema({
    shortName: String,
    stationName: String,
    stationCoord: [Number, Number],
    stationConn: Array<String>,
}, { collection: COLLECTION_NAME });

export const StationModel = mongoose.model('Station', StationSchema, COLLECTION_NAME);

export const getStations = () => StationModel.find();
export const getStationByName = (id: String) => StationModel.findOne({ id });
export const createStation = (values: Record<string, any>) => new StationModel(values)
    .save().then((station) => station.toObject());
export const deleteStationByName = (stationName: string) => StationModel.findOneAndDelete({ stationName });
export const updateStationById = (id: string, values: Record<string, any>) => StationModel.findOneAndUpdate({ id }, values);
export const addStationConnsByName = (stationName: string, values: Record<string, any>) => StationModel.updateOne({ stationName }, { $push: { stationConn: values.stationConn } });

