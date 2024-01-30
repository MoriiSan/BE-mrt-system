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
export const getStationByName = (shortName: String) => StationModel.findOne({ shortName });
export const createStation = (values: Record<string, any>) => new StationModel(values)
    .save().then((station) => station.toObject());
export const deleteStationByName = (shortName: string) => StationModel.findOneAndDelete({ shortName });
export const updateStationByName = (shortName: string, values: Record<string, any>) => StationModel.findOneAndUpdate({ shortName }, values);
export const addStationConnsByName = (shortName: string, values: Record<string, any>) => StationModel.updateOne({ shortName }, { $push: { stationConn: values.stationConn } });


