import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { getMessage } from '../utils/message.util';
import { productRules } from '../utils/yup.util';

const rules = productRules(true);
const looseRules = productRules(false);

const create = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        title: rules.title.required(),
        description: rules.description.required(),
        wasUsed: rules.wasUsed.required(),
        price: rules.price.required(),
        variations: rules.variations,
        active: rules.active,
        userId: rules.userId.required(),
    });

    schema
        .validate({ ...req.body }, { stripUnknown: true })
        .then(result => {
            req.body = result;
            req.params = {};
            req.query = {};
            next();
        })
        .catch(err => {
            return res.status(400).json({
                err: err.errors,
                message: getMessage('default.badRequest'),
            });
        });
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
    const schema = yup.object().shape({
        _id: rules.userId.required(),
    });

    schema
        .validate({ ...req.params }, { stripUnknown: true })
        .then(result => {
            req.params = result;
            req.query = {};
            req.body = {};
            next();
        })
        .catch(err => {
            return res.status(400).json({
                err: err.errors,
                message: getMessage('default.badRequest'),
            });
        });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = Object.keys(looseRules);
    const schemaFields: Record<string, yup.Schema<any>> = requiredFields.reduce(
        (obj: any, field) => {
            obj[field] = looseRules[field];
            return obj;
        },
        {},
    );

    const schemaParams = yup.object().shape({
        _id: rules.userId.required(),
    });

    const schema = yup
        .object()
        .shape({
            ...schemaFields,
        })
        .test(
            'at-least-one-field',
            'you must provide at least one field',
            value => requiredFields.some(field => field in value),
        );

    try {
        req.params = await schemaParams.validate(req.params, {
            stripUnknown: true,
        });
        req.body = await schema.validate(req.body, { stripUnknown: true });
        req.query = {};
        next();
    } catch (err: any) {
        return res.status(400).json({
            err: err.errors,
            message: getMessage('default.badRequest'),
        });
    }
};

const find = async (req: Request, res: Response, next: NextFunction) => {
    let requiredRules = looseRules;
    requiredRules.title = yup.string().min(1).max(500);
    requiredRules.description = yup.string().min(1).max(5000);
    delete requiredRules.userId;
    delete requiredRules.variations;

    const requiredFields = Object.keys(requiredRules);
    const schemaFields: Record<string, yup.Schema<any>> = requiredFields.reduce(
        (obj: any, field) => {
            obj[field] = requiredRules[field];
            return obj;
        },
        {},
    );

    const schema = yup.object().shape({
        ...schemaFields,
    });

    try {
        req.query = await schema.validate(req.query, { stripUnknown: true });
        req.body = {};
        req.params = {};
        next();
    } catch (err: any) {
        return res.status(400).json({
            err: err.errors,
            message: getMessage('default.badRequest'),
        });
    }
};

export default { create, findById, find, update };
