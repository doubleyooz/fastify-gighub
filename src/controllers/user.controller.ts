import { FastifyReply, FastifyRequest } from 'fastify';
import { Types, UpdateQuery } from 'mongoose';
import User, { IUser, LooseIUser } from '../models/user.model';
import { hashPassword } from '../utils/password.util';
import { IsObjectId } from '../utils/schema.util';

const store = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password, name }: IUser = req.body as IUser;

        const trimmedName = name.trim();
        if (trimmedName.length < 3)
            return reply.code(400).send({
                message: 'Bad Request',
                err: 'Trimmed name is too small!',
            });

        const newUser: IUser = new User({
            email: email,
            password: await hashPassword(password),
            name: trimmedName,
        });

        const result = await newUser.save();

        return reply.code(201).send({
            data: {
                email: result.email,
                name: result.name,
                _id: result._id,
            },
            message: 'User created!',
        });
    } catch (err: any) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return reply.code(400).send({
                message: 'Email already in use',
                err: err,
            });
        } else {
            return reply.code(400).send({
                message: 'Bad Request',
                err: err,
            });
        }
    }
};

const findOne = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { _id } = req.params as { _id: string };

        if (!_id) {
            return reply
                .code(400)
                .send({ message: 'Email or _id is required' });
        }
        const search = IsObjectId(_id) ? { _id: _id } : { email: _id };

        const user = await User.findOne(search);

        if (!user) {
            return reply.code(404).send({ message: 'User not found' });
        }
        console.log(user);
        return reply.code(200).send({ message: 'User retrieved.', data: user });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const find = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, email } = req.query as LooseIUser;
        const search: any = {};

        if (name) search.name = { $regex: name, $options: 'i' };
        if (email) search.email = { $regex: email, $options: 'i' };

        const user = await User.find(search);
        console.log(user);

        return reply.code(200).send({ message: 'User retrieved.', data: user });
    } catch (err) {
        console.log(err);
        return reply.code(500).send({ error: err });
    }
};

const update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;
    const metadata = newToken ? { accessToken: newToken } : {};
    const body = req.body as UpdateQuery<LooseIUser>;

    body.name = body.name.trim();
    if (body.name.length < 3)
        return reply.code(400).send({
            message: 'Bad Request',
            err: 'Trimmed name is too small!',
        });

    try {
        const result = await User.updateOne({ _id: auth }, body);
        if (result.matchedCount === 0) {
            reply.code(404).send({ message: 'Not found', ...metadata });
        } else {
            reply.code(200).send({ message: 'User updated', ...metadata });
        }
    } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
    }

    return reply;
};

const _delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { newToken, auth } = req;

    try {
        const result = await User.deleteOne({ _id: auth });
        if (result.deletedCount === 0) {
            reply.code(404).send({ message: 'Not found' });
        } else {
            reply.code(200).send({ message: 'User deleted' });
        }
    } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
    }

    return reply;
};

export default { store, find, findOne, update, _delete };
