import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IGig extends Document {
    title: string;
    description: string;
    contractAddress: string;
    budget: number;
    type: string;
    user: mongoose.Schema.Types.ObjectId;
    skills: string[];
    active?: boolean;
}

export interface LooseIGig {
    title?: string;
    description?: string;
    contractAddress?: string;
    budget?: number;
    type?: string;
    user?: mongoose.Schema.Types.ObjectId;
    skills?: string[];
    active?: boolean;
}

const GigSchema: Schema = new Schema<IGig>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        contractAddress: { type: String, required: true },
        type: { type: String, required: true },
        budget: { type: Number, required: true, min: 0 },
        skills: { type: [String], default: [] },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

GigSchema.index({ title: 1, user: 1 }, { unique: true });

export default mongoose.model<IGig>('Gig', GigSchema);
