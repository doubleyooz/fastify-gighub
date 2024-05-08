import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

type DEFAULT_STATE = 0;
type REJECTED_STATE = 1;
type PENDING_ACCEPTED_STATE = 2;
type CONFIRMED_ACCEPTED_STATE = 3;
export type PROPOSITION_STATUS = // 0 default, 1 rejected, 2 pending-accepted, 3 confirmed-accepted,

        | DEFAULT_STATE
        | REJECTED_STATE
        | PENDING_ACCEPTED_STATE
        | CONFIRMED_ACCEPTED_STATE;

export interface IProposition extends Document {
    description: string;
    budget: number;
    deadline: number;
    status?: PROPOSITION_STATUS;
    user: mongoose.Schema.Types.ObjectId;
    gig: mongoose.Schema.Types.ObjectId;
}

export interface LooseIProposition {
    description?: string;
    budget?: number;
    deadline?: number;
    status?: PROPOSITION_STATUS;

    user?: mongoose.Schema.Types.ObjectId;
    gig?: mongoose.Schema.Types.ObjectId;
}

const PropositionSchema: Schema = new Schema<IProposition>(
    {
        description: { type: String, required: true },
        budget: { type: Number, required: true, min: 10 },
        deadline: { type: Number, required: true, min: 1 },
        status: { type: Number, default: 0 },
        gig: { type: Schema.Types.ObjectId, ref: 'Gig' },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

export default mongoose.model<IProposition>('Proposition', PropositionSchema);
