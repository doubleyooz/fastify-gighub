import { FastifyReply, FastifyRequest } from 'fastify';
import { Types, UpdateQuery } from 'mongoose';
import Gig, { IGig, LooseIGig } from '../models/gig.model';

import { IsObjectId } from '../utils/schema.util';
import { getMessage } from '../utils/message.util';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            active,
            description,
            skills,
            title,
            budget,
            contractAddress,
            type,
        }: IGig = req.body as IGig;

        const newGig: IGig = new Gig({
            type,
            title,
            description,
            active,
            budget,
            contractAddress,
            user: req.auth,
            skills,
        });

        const result = await newGig.save();
        console.log({
            metadata: {
                accessToken: req.newToken,
            },
        });
        const metadata = req.newToken
            ? {
                  accessToken: req.newToken,
              }
            : undefined;
        return reply.code(201).send({
            data: {
                title: result.title,
                budget: result.budget,
                description: result.description,
                _id: result._id,
            },
            metadata,
            message: 'Gig created!',
        });
    } catch (err: any) {
        return reply.code(400).send({
            message: getMessage('default.badRequest'),
            err: err,
        });
    }
};

const find = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { active, skills, description, title, type, user } =
            req.query as LooseIGig;

        const search: LooseIGig = {
            ...(typeof active === 'boolean' && { active }),
            ...(skills && { skills }),
            ...(type && { type }),
            ...(user && { user }),
            ...(title && { title: { $regex: title, $options: 'i' } as any }),
            ...(description && {
                description: { $regex: description, $options: 'i' } as any,
            }),
        };

        const gigsList = await Gig.find(search).populate('user');
        const metadata = req.newToken
            ? {
                  accessToken: req.newToken,
              }
            : undefined;
        return reply.code(200).send({
            message: 'Gigs list retrieved.',
            data: gigsList,
            metadata,
        });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const findOne = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { _id } = req.params as { _id: string };

        if (!_id) {
            return reply.code(400).send({ message: '_id is required' });
        }
        const search = IsObjectId(_id) ? { _id: _id } : { email: _id };

        const gig = await Gig.findOne(search).populate('proposition.user');

        if (!gig) {
            return reply.code(404).send({ message: 'Gig not found' });
        }
        console.log(gig);
        return reply.code(200).send({ message: 'Gig retrieved.', data: gig });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const update = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            active,
            description,
            skills,
            title,
            budget,
            contractAddress,
            type,
        }: IGig = req.body as IGig;

        const { _id } = req.params as { _id: string };

        if (!_id) {
            return reply.code(400).send({ message: getMessage('invalid.object.id') });
        }

        
        const updateBody: LooseIGig = {
            ...(typeof active === 'boolean' && { active }),
            ...(skills && { skills }),
            ...(type && { type }),
            ...(title && { title }),
            ...(budget && { budget }),
            ...(contractAddress && { contractAddress }),
            ...(description && {
                description
            }),
        };

        const result = await Gig.findByIdAndUpdate(_id, {
           ...updateBody
        })

   
      
        const metadata = req.newToken
            ? {
                  accessToken: req.newToken,
              }
            : undefined;
        return reply.code(201).send({
            data: {
                result
            },
            metadata,
            message: 'Gig updated',
        });
    } catch (err: any) {
        return reply.code(400).send({
            message: getMessage('default.badRequest'),
            err: err,
        });
    }
};

const _delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;
    const { _id } = req.params as { _id: string };

    if (!_id) {
        return reply.code(400).send({ message: '_id is required' });
    }

    try {
        const result = await Gig.deleteOne({ _id, user: auth });

        if (result.deletedCount === 0) {
            reply.code(404).send({ message: 'Not found' });
        } else {
            reply.code(200).send({ message: 'Gig deleted' });
        }
    } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
    }

    return reply;
};

export default { store, update, find, findOne, _delete };
