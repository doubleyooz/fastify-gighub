import {
    name,
    nonNumericTitle,
    schema,
    IsObjectId,
    looseSchema,
    valueField,
} from '../utils/schema.util';

const proposition = {
    description: { type: 'string' },
    budget: valueField(5),
    deadline: valueField(1),
};

const metadata = {
    type: 'object',
    properties: {
        token: { type: 'string' },
    },
};

const store = {
    summary: 'creates a new gig and store it',
    consumes: ['application/json'],
    body: schema(proposition),
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
    params: schema({ _id: { type: 'string' } }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        ...proposition,
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
                },
                message: { type: 'string' },
            },
        },
    },
};

const find = {
    summary: 'returns propositions from the database',
    consumes: ['application/json'],
    querystring: looseSchema({
        user: { type: 'string' },
        gigId: { type: 'string' },
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
                            ...proposition,
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
                        required: [
                            'description',
                            'gigId',
                            'budget',
                            'deadline',
                        ],
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
            description: proposition.description,
            budget: proposition.budget,
            deadline: proposition.deadline,
        },
        [
            { required: ['deadline'] },
            { required: ['budget'] },
            { required: ['description'] },
        ],
    ),
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
