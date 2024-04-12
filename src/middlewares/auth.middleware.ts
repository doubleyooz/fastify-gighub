import { FastifyRequest, FastifyReply } from 'fastify';
import User, { IUser } from '../models/user.model';
import { Payload } from '../utils/auth.util';

const auth = async (req: FastifyRequest, reply: FastifyReply) => {
    console.log('middleman');

    const [, token] = req.headers.authorization
        ? req.headers.authorization.split(' ')
        : [, ''];

    let payload: Payload | null = null;
    try {
        payload = await req.accessJwtVerify(token);
        if (!payload) throw new Error();
    } catch (err) {
        if (err instanceof Error)
            return reply.code(401).send({
                message: 'Unauthorized.',
                err: err.message,
            });
        else
            return reply.code(401).send({
                message: 'Unauthorized.',
            });
    }

    const doesUserExists = await User.exists({
        _id: payload._id,
        tokenVersion: payload.tokenVersion,
    });

    if (!doesUserExists)
        return reply.code(401).send({
            message: 'Unauthorized.',
        });

    req.auth = payload._id;

    const current_time = Date.now().valueOf() / 1000;

    if ((payload.exp - payload.iat) / 2 > payload.exp - current_time) {
        const newToken = await reply.accessJwtSign({
            _id: payload._id,
            tokenVersion: payload.tokenVersion,
            exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
        });

        req.newToken = `${newToken}`;
        console.log(`New Token: ${newToken}`);
    }
    console.log('shall pass');
    payload = null;
};

export default { auth };
