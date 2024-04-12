import { FastifyReply, FastifyRequest } from 'fastify';
import { Types, UpdateQuery } from 'mongoose';
import Gig, { IGig, LooseIGig } from '../models/gig.model';

import { IsObjectId } from '../utils/schema.util';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { active, preferredTechnologies, title, type }: IGig =
            req.body as IGig;

        const newGig: IGig = new Gig({
            type,
            title,
            active,
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

export default { store };
