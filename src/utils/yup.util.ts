import mongoose from 'mongoose';
import * as yup from 'yup';
import { getMessage } from './message.util';

type Rules = {
    [key: string]: yup.Schema<any> | yup.NumberSchema | yup.StringSchema;
}

function isValidMongoIdRequired(value: string) {
    return (
        value != null &&
        mongoose.Types.ObjectId.isValid(value) &&
        String(new mongoose.Types.ObjectId(value)) === value
    );
}

function isValidMongoId(value: string) {
    if (mongoose.Types.ObjectId.isValid(value)) {
        const id = new mongoose.Types.ObjectId(value);
        return id.toString() === value;
    }
    return false;
}
const mongo_id = yup
    .string()
    .test('isValidMongoId', getMessage('invalid.object.id'), value =>
        isValidMongoId(value || ''),
    );
const mongo_id_req = yup
    .string()
    .test('isValidMongoId', getMessage('invalid.object.id'), value =>
        isValidMongoIdRequired(value || ''),
    );

const title = yup
    .string()
    .min(3)
    .max(20)
    .trim()
    .matches(/^((?![^a-zA-Z0-9,: ;./-]).)*$/, 'no special characters allowed');

const description = yup
    .string()
    .min(20)
    .max(5000)
    .trim()
    .matches(/^((?![^a-zA-Z0-9,: ;./-]).)*$/, 'no special characters allowed');

const wasUsed = yup.boolean();

const price = yup.number().min(10).max(500000);

const variations = yup.array(yup.string()).max(7, '');

const productRules = (required: boolean) : Rules => {
    return {
        title,
        description,
        wasUsed,
        price,
        variations,
        active: wasUsed,
        userId: required ? mongo_id_req : mongo_id,
    };
};

export { productRules };
