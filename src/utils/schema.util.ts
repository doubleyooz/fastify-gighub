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

export const user = {
    name: { type: 'string' },
    email: { type: 'string' },
    picture: { type: 'string' },
    _id: { type: 'string' },
};

const emailPattern =
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

const objectIdPattern = '^[0-9a-f]{24}$';

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
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$',
};

export const name = {
    type: 'string',
    minLength: 3,
    maxLength: 15,
    pattern: '^[A-Za-z ]+$',
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

export const nonNumericTitle = (min: number, maxLength: number) => {
    return {
        type: 'string',
        minLength: min,
        maxLength: maxLength,
        pattern: '^[A-Za-z ]+$',
    };
};

export const picture = {
    type: 'string',
};

export const Authorization = {
    type: 'string',
    minLength: 10,
    description: 'Bearer token of the user.',
};
