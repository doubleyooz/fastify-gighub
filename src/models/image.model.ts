import mongoose, { Document, Schema } from 'mongoose';
import { IMAGE } from '../utils/constants';

export interface IImage extends Document {
    size: number;
    ext: string;
}

export interface LooseIImage {
    size?: number;
    ext?: string;
}

const ImageSchema: Schema = new Schema<IImage>(
    {
        size: Number,
        ext: String,
    },
    { timestamps: true },
);

export default mongoose.model<IImage>(IMAGE, ImageSchema);
