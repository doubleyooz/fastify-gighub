import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';
import { ISkill } from './skill.model';
import { GIG, SKILL, USER } from '../utils/constants';

export interface IGig extends Document {
    title: string;
    description: string;
    contractAddress: string;
    budget: number;
    type: string;
    user: mongoose.Schema.Types.ObjectId;
    skills: ISkill[];
    active?: boolean;
    archived_at?: string;
}

export interface LooseIGig {
    title?: string;
    description?: string;
    contractAddress?: string;
    budget?: number;
    type?: string;
    user?: mongoose.Schema.Types.ObjectId;
    skills?: ISkill[];
    active?: boolean;
    archived_at?: string;
}

const GigSchema: Schema = new Schema<IGig>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        contractAddress: { type: String, required: true, unique: true },
        type: { type: String, required: true },
        budget: { type: Number, required: true, min: 0 },
        skills: [{ type: Schema.Types.ObjectId, ref: SKILL }],

        user: { type: Schema.Types.ObjectId, ref: USER },
        active: { type: Boolean, default: true },
        archived_at: { type: String, default: null },
    },
    { timestamps: true },
);

GigSchema.index({ title: 1, user: 1 }, { unique: true });

export default mongoose.model<IGig>(GIG, GigSchema);
