import { email, password, Authorization, schema } from '../utils/schema.util';

const signIn = {
    summary:
        'Validate the provided email and password, it will return an access token if it passes the validation',
    consumes: ['application/json'],
    headers: schema({ Authorization: Authorization }),
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                    },
                },
                metadata: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                    },
                },

                message: { type: 'string' },
            },
        },
    },
};

const revokeToken = {
    summary:
        "Revoke user's refresh tokens, it will be succesful if it receives a valid refresh token",
    consumes: ['application/json'],
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

const refreshToken = {
    summary:
        "Revoke user's refresh tokens, it will be succesful if it receives a valid refresh token",
    consumes: ['application/json'],
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                    },
                },
                message: { type: 'string' },
                metadata: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                    },
                },
            },
        },
    },
};

export default { refreshToken, revokeToken, signIn };
