import mongoose from "mongoose";

const COLLECTION_NAME = 'adminConfigs';

const FareSchema = new mongoose.Schema({
    fare: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

export const FareModel = mongoose.model('Fare', FareSchema, COLLECTION_NAME);

export const getFare = () => FareModel.find();
export const updateFare = (fare: number) => FareModel.findOneAndUpdate({ fare });


