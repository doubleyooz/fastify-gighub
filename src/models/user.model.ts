import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    title?: string;
    description?: string;
    picture?: mongoose.Schema.Types.ObjectId | null;
    wallet?: string;
    tokenVersion?: number;
}

export interface LooseIUser {
    email?: string;
    password?: string;
    name?: string;
    description?: string;
    title?: string;
    picture?: mongoose.Schema.Types.ObjectId | null;
    wallet?: string;
    tokenVersion?: number;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true, select: false },
        picture: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
        title: { type: String, default: null },
        wallet: { type: String, default: null },
        name: { type: String, required: true },
        description: { type: String, default: null },
        tokenVersion: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
