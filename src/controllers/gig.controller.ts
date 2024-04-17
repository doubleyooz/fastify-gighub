import { FastifyReply, FastifyRequest } from 'fastify';
import { Types, UpdateQuery } from 'mongoose';
import Gig, { IGig, LooseIGig } from '../models/gig.model';

import { IsObjectId } from '../utils/schema.util';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            active,
            description,
            preferredTechnologies,
            title,
            minPrice,
            type,
        }: IGig = req.body as IGig;

        const newGig: IGig = new Gig({
            type,
            title,
            description,
            active,
            minPrice,
            userId: req.auth,
            preferredTechnologies,
        });

        const result = await newGig.save();

        return reply.code(201).send({
            data: {
                title: result.title,
                description: result.description,
                _id: result._id,
            },
            message: 'Gig created!',
        });
    } catch (err: any) {
        return reply.code(400).send({
            message: 'Bad Request',
            err: err,
        });
    }
};

const find = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            active,
            preferredTechnologies,
            description,
            title,
            type,
            userId,
        } = req.query as LooseIGig;

        const search: LooseIGig = {
            ...(typeof active === 'boolean' && { active }),
            ...(preferredTechnologies && { preferredTechnologies }),
            ...(type && { type }),
            ...(userId && { userId }),
            ...(title && { title: { $regex: title, $options: 'i' } as any }),
            ...(description && {
                description: { $regex: description, $options: 'i' } as any,
            }),
        };

        const gig = await Gig.find(search);

        return reply
            .code(200)
            .send({ message: 'Gigs list retrieved.', data: gig });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};
export default { store, find };
