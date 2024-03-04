import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = 'cards';

const Logs = new Schema ({
    charge: String,
    dateTravel: String,
    topUp: String,
    dateLoaded: String,
})

const CardSchema = new mongoose.Schema({
    uid: { type: Number, required: true },
    bal: { type: Number, required: true },
    tapState: { type: String },
    devId: { type: String },
    logs: { type: [Logs] },
}, { collection: COLLECTION_NAME });

export const CardModel = mongoose.model('Card', CardSchema, COLLECTION_NAME);

export const getCards = () => CardModel.find();
export const getCardByUid = (uid: number) => CardModel.findOne({ uid });
export const createCard = (values: Record<string, any>) => new CardModel(values)
    .save().then((card) => card.toObject());
export const deleteCardByUid = (uid: number) => CardModel.findOneAndDelete({ uid });
export const updateCardByUid = (uid: number, values: Record<string, any>) => CardModel.findOneAndUpdate({ uid }, values);


