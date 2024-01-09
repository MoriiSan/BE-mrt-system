import mongoose from "mongoose";

const COLLECTION_NAME = 'admin';

const UserSchema = new mongoose.Schema({
    username: {type:String, required: true},
    email: {type:String, required: true},
    authentication: {
        password: {type:String, required:true, select: false},
        salt: {type:String, select: false},
        sessionToken: {type:String, select: false},
    },
}, { collection: COLLECTION_NAME });

export const UserModel = mongoose.model('User', UserSchema, COLLECTION_NAME );

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email:string) => UserModel.findOne({ email });
export const getUserByUsername = (username:string) => UserModel.findOne({ username})
export const getUserBySessionToken = (sessionToken:string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
.save().then((user)=> user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

export const decodeJson = (encodedJson: string) => {
    try {
        return JSON.parse(encodedJson);
    } catch (error) {
        console.error('Error decoding JSON:', error);
        return null;
    }
};