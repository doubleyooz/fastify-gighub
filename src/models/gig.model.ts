import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IGig extends Document {
    title: string;
    description: string;
    minPrice: number;
    type: string;
    preferredTechnologies: string[];
    active?: boolean;

    userId?: string;
}

export interface LooseIGig {
    title?: string;
    description?: string;
    minPrice?: number;
    type?: string;
    preferredTechnologies: string[];
    active?: boolean;
}

const GigSchema: Schema = new Schema<IGig>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        minPrice: { type: Number, required: true, min: 0 },
        preferredTechnologies: { type: [String] },
        userId: { type: String, required: true },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

GigSchema.index({ title: 1, userId: 1 }, { unique: true });

export default mongoose.model<IGig>('Gig', GigSchema);
