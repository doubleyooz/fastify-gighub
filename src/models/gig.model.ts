import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IGig extends Document {
    title: string;
    description: string;
    budget: number;
    type: string;
    userId: mongoose.Schema.Types.ObjectId;
    preferredTechnologies: string[];
    active?: boolean;
}

export interface LooseIGig {
    title?: string;
    description?: string;
    budget?: number;
    type?: string;
    userId?: mongoose.Schema.Types.ObjectId;
    preferredTechnologies?: string[];
    active?: boolean;
}

const GigSchema: Schema = new Schema<IGig>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        budget: { type: Number, required: true, min: 0 },
        preferredTechnologies: { type: [String] },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

GigSchema.index({ title: 1, userId: 1 }, { unique: true });

export default mongoose.model<IGig>('Gig', GigSchema);
