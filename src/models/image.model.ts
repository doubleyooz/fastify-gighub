import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
    size: number;
    filename: string;
    mimetype: string;
}

export interface LooseIImage {
    size?: number;
    filename?: string;
    mimetype?: string;
}

const ImageSchema: Schema = new Schema<IImage>(
    {
        size: Number,
        filename: {
            type: String,
        },

        mimetype: String,
    },
    { timestamps: true },
);

export default mongoose.model<IImage>('Image', ImageSchema);
