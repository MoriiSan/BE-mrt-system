import mongoose from "mongoose";

const COLLECTION_NAME = 'adminConfigs';

const FareSchema = new mongoose.Schema({
    fareId: { type: Number},
    fareKm: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

export const FareModel = mongoose.model('Fare', FareSchema, COLLECTION_NAME);

export const getFare = () => FareModel.find();
// export const getFareById = (fareId:number) => FareModel.findById(fareId);
// export const updateFare = (fare: number) => FareModel.findOneAndUpdate({ fare });
export const updateFare = (fareId: number, values: Record<string, any>) => FareModel.findOneAndUpdate({ fareId }, values);


