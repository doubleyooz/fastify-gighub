import { FastifyRequest, FastifyReply } from 'fastify';
import Gig, { IGig } from '../models/gig.model';

const trimFields = async (req: FastifyRequest, reply: FastifyReply) => {
    const { title, description }: IGig = req.body as IGig;

    if (description) {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length < 3)
            return reply.code(400).send({
                message: 'Bad Request',
                err: 'Trimmed description is too small!',
            });
        (req.body as IGig).description = trimmedDescription;
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3)
        return reply.code(400).send({
            message: 'Bad Request',
            err: 'Trimmed title is too small!',
        });
    (req.body as IGig).title = trimmedTitle;
};

export default { trimFields };
