import { FastifyRequest, FastifyReply } from 'fastify';
import User, { IUser } from '../models/user.model';

const trimFields = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, description }: IUser = req.body as IUser;

    if (description) {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length < 3)
            return reply.code(400).send({
                message: 'Bad Request',
                err: 'Trimmed description is too small!',
            });
        (req.body as IUser).description = trimmedDescription;
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 3)
        return reply.code(400).send({
            message: 'Bad Request',
            err: 'Trimmed name is too small!',
        });
    (req.body as IUser).name = trimmedName;
};

export default { trimFields };
