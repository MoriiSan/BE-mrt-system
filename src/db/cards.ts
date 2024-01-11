import mongoose from "mongoose";

const COLLECTION_NAME = 'card';

const cardSchema = new mongoose.Schema({
    uid: {type:Number},
    bal: {type:Number},
}, { collection: COLLECTION_NAME });