import { FastifyReply, FastifyRequest } from 'fastify';
import { Types, UpdateQuery } from 'mongoose';
import Proposition, {
    IProposition,
    LooseIProposition,
    PROPOSITION_STATUS,
} from '../models/proposition.model';

import { IsObjectId } from '../utils/schema.util';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const {
            description,
            deadline,
            budget,
            gig: gigIdBody,
        }: IProposition = req.body as IProposition;

        let gigId;
        if (!gigIdBody) gigId = (req.params as { gigId: string }).gigId;
        else gigId = gigIdBody;

        const newProposition: IProposition = new Proposition({
            description,
            gig: gigId,
            deadline,
            budget,
            user: req.auth,
        });

        const result = await newProposition.save();
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
                description: result.description,
                deadline: result.deadline,
                budget: result.budget,
                _id: result._id,
            },
            metadata,
            message: 'Proposition created!',
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
        const { gig: gigId, user, status } = req.query as LooseIProposition;

        const search: LooseIProposition = {
            ...(user && { user }),
            ...(status && { status: status as PROPOSITION_STATUS }),
            ...(gigId && { gig: gigId }),
        };

        const propositionsList = await Proposition.find(search).populate(
            'user',
        );
        console.log({ propositionsList });
        const metadata = req.newToken
            ? {
                  accessToken: req.newToken,
              }
            : undefined;
        return reply.code(200).send({
            message: 'Propositions list retrieved.',
            data: propositionsList,
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

        const proposition = await Proposition.findOne(search).populate('gig');

        if (!proposition) {
            return reply.code(404).send({ message: 'Proposition not found' });
        }
        console.log(proposition);
        return reply
            .code(200)
            .send({ message: 'Proposition retrieved.', data: proposition });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;
    const metadata = newToken ? { accessToken: newToken } : {};
    const body = req.body as UpdateQuery<LooseIProposition>;

    const { _id } = req.params as { _id: string };
    if (body.description) {
        body.description = body.description.trim();

        if (body.description?.length < 3)
            return reply.code(400).send({
                message: 'Bad Request',
                err: 'Trimmed description is too small!',
            });
    }

    try {
        const result = await Proposition.updateOne({ _id }, body);
        if (result.matchedCount === 0) {
            reply.code(404).send({ message: 'Not found', ...metadata });
        } else {
            reply
                .code(200)
                .send({ message: 'Proposition updated', ...metadata });
        }
    } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
    }

    return reply;
};

const _delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;
    const { _id } = req.params as { _id: string };

    if (!_id) {
        return reply.code(400).send({ message: '_id is required' });
    }

    try {
        const result = await Proposition.deleteOne({ _id, user: auth });

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

export default { store, find, findOne, update, _delete };
