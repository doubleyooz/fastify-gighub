import mongoose, { Document, Schema, SchemaTypeOptions } from 'mongoose';

export interface ISkill extends Document {
    title: string;
    users: mongoose.Schema.Types.ObjectId[];
    gigs: mongoose.Schema.Types.ObjectId[];
}

export interface LooseISkill {
    title?: string;
    users?: mongoose.Schema.Types.ObjectId[];
    gigs?: mongoose.Schema.Types.ObjectId[];
}

const SkillSchema: Schema = new Schema<ISkill>(
    {
        title: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        gigs: [{ type: Schema.Types.ObjectId, ref: 'Gig' }],
    },
    { timestamps: true },
);

SkillSchema.index({ title: 1 }, { unique: true });

// Bind the correct context to the pre-remove hook
SkillSchema.pre(
    'remove' as unknown as RegExp | 'createCollection',
    function (next) {
        const self = this as any; // Store the current context

        // Now, self refers to the Mongoose document
        self.model('Gig').updateMany({ $pull: { skills: self._id } }, next);
        self.model('Users').updateMany({ $pull: { skills: self._id } }, next);
    },
);
export default mongoose.model<ISkill>('Skill', SkillSchema);
