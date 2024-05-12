import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

type DEFAULT_STATE = 0;
type REJECTED_STATE = 1;
type PENDING_HIRER_APPROVAL_STATE = 2;
type PENDING_FREELANCER_APPROVAL_STATE = 3;
type PENDING_FINAL_APPROVAL_STATE = 4;
type ON_GOING_STATE = 5;
type FULFILLED_STATE = 6;
type CANCELLED_STATE = 7;

export type PROPOSITION_STATUS =
    | DEFAULT_STATE
    | REJECTED_STATE
    | PENDING_HIRER_APPROVAL_STATE
    | PENDING_FREELANCER_APPROVAL_STATE
    | PENDING_FINAL_APPROVAL_STATE
    | ON_GOING_STATE
    | FULFILLED_STATE
    | CANCELLED_STATE;

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
