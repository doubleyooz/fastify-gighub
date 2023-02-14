import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    wasUsed: boolean;
    price: number;
    colour: string[];
}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        wasUsed: { type: Boolean, required: true },
        price: { type: Number, required: true, min: 0 },
        colour: { type: [String], required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IProduct>('Product', ProductSchema);
