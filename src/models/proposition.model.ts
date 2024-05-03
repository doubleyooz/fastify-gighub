import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface IProposition extends Document {
    description: string;
    budget: number;
    deadline: number;
    user: mongoose.Schema.Types.ObjectId;
    gigId: mongoose.Schema.Types.ObjectId;
}

export interface LooseIProposition {
    description?: string;
    budget?: number;
    deadline?: number;
    user?: mongoose.Schema.Types.ObjectId;
    gigId?: mongoose.Schema.Types.ObjectId;
}

const PropositionSchema: Schema = new Schema<IProposition>(
    {
        description: { type: String, required: true },
        budget: { type: Number, required: true, min: 10 },
        deadline: { type: Number, required: true, min: 1 },
        gigId: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

export default mongoose.model<IProposition>('Proposition', PropositionSchema);
