import { FastifyReply, FastifyRequest } from 'fastify';
import User, { IUser } from '../models/user.model';
import { Payload } from '../utils/auth.util';
import { matchPassword } from '../utils/password.util';

const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
    const [hashType, hash] = req.headers?.authorization?.split(' ') ?? ['', ''];

    if (hashType !== 'Basic') {
        return reply.code(401).send({ message: 'Unauthorized Request' });
    }

    const [email, supposedPassword] = Buffer.from(hash, 'base64')
        .toString()
        .split(':');

    const user = await User.findOne({ email: email }).select([
        'name',
        'picture',
        'password',
        'tokenVersion',
    ]);

    const match = user
        ? await matchPassword(user.password, supposedPassword)
        : false;

    if (!match) {
        return reply.code(401).send({
            message: 'Unauthorized request.',
        });
    }
    const token = await reply.accessJwtSign({
        _id: user?._id,
        tokenVersion: user?.tokenVersion,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
    });

    const refreshToken = await reply.refreshJwtSign({
        _id: user?._id,
        tokenVersion: user?.tokenVersion,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, //1 hour
    });

    req.headers.authorization = `Bearer ${token}`;

    reply.setCookie('jid', refreshToken, {
        domain: process.env.CLIENT,
        sameSite: 'none',
        path: '/revoke-token',
        httpOnly: true,
    });
    reply.setCookie('jid', refreshToken, {
        domain: process.env.CLIENT,
        sameSite: 'none',
        path: '/refresh-token',
        httpOnly: true,
    });

    reply.code(200).send({
        data: {
            _id: user?._id,
            name: user?.name,
            picture: user?.picture,
        },
        message: 'Successful login.',
        metadata: {
            accessToken: token,
        },
    });
    return reply;
};

const revokeRefreshToken = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.jid;

    if (!refreshToken) return reply.code(401).send({ message: 'Unauthorized' });

    let payload: Payload | null = null;

    try {
        payload = await req.refreshJwtVerify(refreshToken);
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized.' });
    }

    if (!payload) return reply.code(401).send({ message: 'Unauthorized.' });

    const user = await User.findById(payload._id);

    if (!user) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }

    user.tokenVersion! += 1;
    try {
        await user.save();
        return reply.code(200).send({ message: 'Successful Request.' });
    } catch (err) {
        return reply.code(500).send({ message: "It's not you it's us." });
    }
};

const refreshAccessToken = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.jid;
    console.log(req.cookies);
    if (!refreshToken) {
        return reply.code(401).send({
            message: 'Unauthorized request.',
        });
    }

    let payload: Payload | null = null;
    console.log(refreshToken);

    try {
        payload = await req.refreshJwtVerify(refreshToken);
    } catch (err) {
        console.log(err);
        return reply.code(401).send({
            message: 'Unauthorized request.',
        });
    }
    console.log('AUTH CONTROLLER');
    console.log(payload);
    if (!payload)
        return reply.code(401).send({
            message: 'Unauthorized request.',
        });

    const doesUserExists = await User.exists({
        _id: payload._id,
        tokenVersion: payload.tokenVersion,
    });

    if (!doesUserExists)
        return reply.code(401).send({
            message: 'Unauthorized request.',
        });

    const accessToken = await reply.accessJwtSign({
        _id: payload._id,
        tokenVersion: payload.tokenVersion,
    });

    return reply.code(200).send({
        data: { _id: payload._id },
        metadata: { accessToken },
        message: 'Successful request.',
    });
};

const me = async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
        data: { _id: req.auth },

        message: 'Successful request.',
    });
};

export default { refreshAccessToken, revokeRefreshToken, me, signIn };
