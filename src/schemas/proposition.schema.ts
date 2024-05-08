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
    gig: { type: 'string' },
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
                        gig: {
                            _id: {
                                type: 'string',
                            },
                            contractAddress: {
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
        gig: { type: 'string' },

        status: { type: 'number' },
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
                            status: { type: 'number' },
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
                        required: [
                            'description',
                            'gig',
                            'budget',
                            'status',
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
    summary: 'update an existing proposition',
    consumes: ['application/json'],
    body: looseSchema(
        {
            description: proposition.description,
            budget: proposition.budget,
            deadline: proposition.deadline,
            status: { type: 'number' },
        },
        [
            { required: ['deadline'] },
            { required: ['budget'] },
            { required: ['status'] },
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
