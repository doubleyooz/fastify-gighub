import {
    name,
    nonNumericTitle,
    schema,
    IsObjectId,
    looseSchema,
    valueField,
    metadata,
    _id,
    user,
} from '../utils/schema.util';

const skill = {
    title: nonNumericTitle(1, 30),
};

const users = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
            },
            picture: {
                type: 'string',
            },

            _id,
        },
    },
};
const gigs = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            picture: {
                type: 'string',
            },

            _id,
        },
    },
};

const store = {
    summary: 'creates a new gig and store it',
    consumes: ['application/json'],
    body: schema(skill),
    response: {
        200: {
            type: 'object',
            properties: {
                data: { type: 'string' },
                message: { type: 'string' },
                metadata,
            },
        },
    },
};

const findOne = {
    summary: 'returns a skill from the database',
    consumes: ['application/json'],
    params: schema({ _id }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: { ...skill, users, gigs },
                },
                message: { type: 'string' },
            },
        },
    },
};

const find = {
    summary: 'returns skills from the database',
    consumes: ['application/json'],
    querystring: looseSchema({
        title: nonNumericTitle(1, 30),
        user_id: { type: 'string' },
        gig_id: { type: 'string' },
    }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            ...skill,
                            _id: { type: 'string' },
                            users,
                            gigs,
                        },
                        required: ['title', '_id'],
                    },
                },
                metadata,
            },
        },
    },
};

const update = {
    summary: 'update an existing gig',
    consumes: ['application/json'],
    body: schema({ title: nonNumericTitle(1, 15) }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
};

export default { store, find, findOne, update };
