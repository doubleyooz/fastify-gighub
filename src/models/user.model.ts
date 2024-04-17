import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    picture?: string;
    wallet?: string;
    tokenVersion?: number;
}

export interface LooseIUser {
    email?: string;
    password?: string;
    name?: string;
    picture?: string;
    wallet?: string;
    tokenVersion?: number;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true, select: false },
        picture: { type: String, default: null },
        wallet: { type: String, default: null },
        name: { type: String, required: true },
        tokenVersion: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
