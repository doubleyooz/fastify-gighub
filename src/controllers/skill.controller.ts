import { FastifyReply, FastifyRequest } from 'fastify';
import mongoose, { Types, UpdateQuery } from 'mongoose';
import Skill, { ISkill, LooseISkill } from '../models/skill.model';
import User, { IUser, LooseIUser } from '../models/user.model';
import Gig, { IGig, LooseIGig } from '../models/gig.model';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { title }: ISkill = req.body as ISkill;

        console.log(req.body);

        const newSkill: ISkill = new Skill({
            title: title,
        });
        console.log({ newSkill });
        const result = await newSkill.save();

        return reply.code(201).send({
            data: {
                title: result.title,
                _id: result._id,
            },
            message: 'Skill created!',
        });
    } catch (err: any) {
        console.log({ err });

        return reply.code(400).send({
            message: 'Bad Request',
            err: err,
        });
    }
};

const findOne = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { _id } = req.params as { _id: string };

        if (!_id) {
            return reply.code(400).send({ message: '_id is required' });
        }

        const skill = await Skill.findOne({ _id: _id }).populate([
            'users',
            'gigs',
        ]);

        if (!skill) {
            return reply.code(404).send({ message: 'Skill not found' });
        }
        console.log(skill);
        return reply
            .code(200)
            .send({ message: 'Skill retrieved.', data: skill });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const find = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { title } = req.query as LooseISkill;
        const search: any = {};

        if (title) search.title = { $regex: title, $options: 'i' };

        const skills = await Skill.find(search);
        console.log(skills);

        return reply
            .code(200)
            .send({ message: 'Skills retrieved.', data: skills });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;
    const metadata = newToken ? { accessToken: newToken } : {};
    const body = req.body as UpdateQuery<LooseISkill>;

    if (body.title) {
        body.title = body.title.trim();
    }

    try {
        const result = await Skill.updateOne({ _id: auth }, body);
        if (result.matchedCount === 0) {
            return reply
                .code(404)
                .send({ message: 'Skill not found', ...metadata });
        }
        return reply.code(200).send({
            data: { ...body },
            message: 'Skill updated',
            ...metadata,
        });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const _delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth, params } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await Skill.deleteOne({
            _id: (params as { _id: string })._id,
        }).session(session);

        if (result.deletedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return reply.code(404).send({ message: 'Skill not found' });
        }

        await session.commitTransaction();
        session.endSession();
        return reply.code(200).send({ message: 'Skill deleted' });
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return reply.code(500).send({ error: err });
    }
};
export default { store, find, findOne, update, _delete };
