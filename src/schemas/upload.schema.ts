import { schema } from '../utils/schema.util';

const uploadProfilePicture = {
    summary: 'returns a msg from the server',
    consumes: ['application/json'],
    body: undefined,
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                },
                message: { type: 'string' },
            },
        },
    },
};

export default { uploadProfilePicture };
