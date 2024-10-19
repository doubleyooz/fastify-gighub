import {
    name,
    nonNumericTitle,
    schema,
    IsObjectId,
    looseSchema,
    valueField,
    metadata,
    user,
    _id,
} from '../utils/schema.util';

const gig = {
    title: nonNumericTitle(1, 30),
    description: { type: 'string' },
    contractAddress: { type: 'string' },
    budget: valueField(5),
    type: { type: 'string' },
    skills: { type: 'array', items: { type: 'string' } },
};

const store = {
    summary: 'creates a new gig and store it',
    consumes: ['application/json'],
    body: schema(gig),
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
    summary: 'returns a gig from the database',
    consumes: ['application/json'],
    params: schema({ _id }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: { ...gig, active: { type: 'boolean' } },
                },
                message: { type: 'string' },
            },
        },
    },
};

const find = {
    summary: 'returns gigs from the database',
    consumes: ['application/json'],
    querystring: looseSchema({
        title: nonNumericTitle(1, 30),
        description: { type: 'string' },
        type: { type: 'string' },
        user: { type: 'string' },
        skills: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        active: { type: 'boolean' },
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
                            ...gig,
                            _id: { type: 'string' },
                            user: {
                                email: {
                                    type: 'string',
                                },
                                picture: {
                                    type: 'string',
                                },

                                _id: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['title', 'description', '_id', 'active'],
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
    body: looseSchema(
        {
            title: nonNumericTitle(1, 30),
            description: { type: 'string' },
            type: { type: 'string' },
            budget: { type: 'number' },
            skills: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            active: { type: 'boolean' },
        },
        [{ required: ['title'] }, { required: ['description'] }],
    ),
    params: schema({ _id }),
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
