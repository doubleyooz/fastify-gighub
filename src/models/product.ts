import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    wasUsed: boolean;
    price: number;
    variations?: string[];
    active?: boolean;

    userId?: string;
}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        wasUsed: { type: Boolean, required: true },
        price: { type: Number, required: true, min: 0 },
        variations: { type: [String] },
        userId: { type: String, required: true, select: false },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

ProductSchema.index({ title: 1, userId: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
