import { Types } from 'mongoose';

export const schema = (props: Record<string, any>) => {
    return {
        type: 'object',
        additionalProperties: false,
        properties: {
            ...props,
        },
        required: [...Object.keys(props)],
    };
};

export const looseSchema = (
    props: Record<string, any>,
    requiredProperties?: {
        required: string[];
    }[],
) => {
    return {
        type: 'object',
        additionalProperties: false,
        properties: {
            ...props,
        },
        anyOf: requiredProperties,
    };
};

export const IsObjectId = (value: string) => {
    try {
        new Types.ObjectId(value);
        return true;
    } catch (error) {
        return false;
    }
};

const emailPattern =
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

const objectIdPattern = '^[0-9a-f]{24}$';

export const _id = {
    type: 'string',
    pattern: objectIdPattern,
};

export const email = {
    type: 'string',
    pattern: emailPattern,
};

export const emailOrId = {
    type: 'string',
    pattern: `${emailPattern}|${objectIdPattern}`,
};

export const password = {
    type: 'string',
    // pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$',
};

export const wallet = {
    minLength: 4,
    type: ['string', 'null'],
    // pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$',
};

export const title = {
    minLength: 3,
    type: ['string', 'null'],
    // pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$',
};

export const userTitle = {
    type: ['string', 'null'],
    // pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$',
};

export const name = {
    type: 'string',
    minLength: 3,
    maxLength: 15,
    pattern: '^[A-Za-z ]+$',
};

export const description = {
    type: 'string',
    minLength: 3,
    maxLength: 400,
    pattern: `^[A-Za-z0-9 _.,!;:)("'/$]*$`,
};

export const image = {
    size: { type: 'number' },
    ext: { type: 'string' },
    _id,
};

export const skill = {
    _id,
    title: { type: 'string' },
};

export const user = {
    name,
    email: { type: 'string' },
    picture: { type: 'object', properties: { ...image } },
    title,
    wallet,
    skills: {
        type: 'array',
        items: { type: 'object', properties: { ...skill } },
    },
    description: { type: 'string' },
    _id,
};

export const searchName = {
    type: 'string',
    minLength: 1,
    maxLength: 15,
    pattern: '^[A-Za-z ]+$',
};

export const searchString = {
    type: 'string',
    minLength: 1,
};

export const address = {
    type: 'string',
    minLength: 1,
};

export const message = {
    type: 'string',
    minLength: 1,
};

export const signedMessage = {
    type: 'string',
    minLength: 1,
};

export const nonNumericTitle = (min: number, maxLength: number) => {
    return {
        type: 'string',
        minLength: min,
        maxLength: maxLength,
        pattern: '^[A-Za-z ]+$',
    };
};

export const metadata = {
    type: 'object',
    properties: {
        token: { type: 'string' },
    },
};

export const valueField = (min?: number, max?: number) => {
    return {
        type: 'number',
        ...(min && { minimum: min }),
        ...(max && { maximum: max }),
    };
};

export const Authorization = {
    type: 'string',
    minLength: 10,
    description: 'Bearer token of the user.',
};
