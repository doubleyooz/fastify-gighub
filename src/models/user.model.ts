import mongoose, { Schema, Document } from 'mongoose';
import skillModel, { ISkill } from './skill.model';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    title?: string;
    description?: string;
    skills?: ISkill[];
    picture?: mongoose.Schema.Types.ObjectId | null;
    wallet?: string;
    tokenVersion?: number;
}

export interface LooseIUser {
    email?: string;
    password?: string;
    name?: string;
    description?: string;
    title?: string;
    picture?: mongoose.Schema.Types.ObjectId | null;
    skills?: ISkill[];
    wallet?: string;
    tokenVersion?: number;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true, select: false },
        picture: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
        title: { type: String, default: null },
        wallet: { type: String, default: null },
        name: { type: String, required: true },
        skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],

        description: { type: String, default: null },
        tokenVersion: { type: Number, default: 0 },
    },
    { timestamps: true },
);

UserSchema.pre(
    'remove' as unknown as RegExp | 'createCollection',
    function (next) {
        const self = this as unknown as typeof mongoose & { _id: any }; // Store the current context

        // Now, self refers to the Mongoose document
        self.model('Gig').updateMany(
            { user: self._id },
            { archived_at: new Date().toISOString() },
            next,
        );
        self.model('Skill').updateMany({ $pull: { users: self._id } }, next);
    },
);

export default mongoose.model<IUser>('User', UserSchema);
