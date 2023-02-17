import { Request, Response } from 'express';
import Product, { IProduct } from '../models/product';
import { getMessage } from '../utils/message.util';

const create = async (req: Request, res: Response) => {
    const { title, description, variations, wasUsed, price, userId }: IProduct =
        req.body;

    const newProduct: IProduct = new Product({
        title,
        ...(variations && { variations }),
        wasUsed,
        price,
        description,
        userId,
    });

    newProduct
        .save()
        .then(result => {
            return res.status(200).json({
                data: result,
                message: getMessage('default.success'),
            });
        })
        .catch(err => {
            if (err.code === 11000) {
                //next(new Error("There was a duplicate key error"));
                return res.status(400).json({
                    message: getMessage('product.duplicated.title.user'),
                });
            } else {
                return res
                    .status(500)
                    .json({ message: getMessage('default.serverError') });
            }
        });
};

const findOneById = async (req: Request, res: Response) => {
    const { _id } = req.params;

    Product.findById(_id)
        .then(result => {
            if (result) {
                return res.status(200).json({
                    data: result,
                    message: getMessage('default.success'),
                });
            }
            return res.status(404).json({
                message: getMessage('default.notfound'),
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: getMessage('default.serverError'),
                err: err,
            });
        });
};

const find = async (req: Request, res: Response) => {
    const { title, description, wasUsed, active, price } = req.query;

    let docs: IProduct[] = [];

    const search = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(description && {
            description: { $regex: description, $options: 'i' },
        }),
        ...(wasUsed && { wasUsed }),
        ...(active && { active }),
        ...(price && { price }),
    };

    (await Product.find(search).sort('updatedAt')).forEach(doc => {
        docs.push(doc);
    });

    if (docs.length === 0) {
        return res.json({
            message: getMessage('default.notfound'),
        });
    } else {
        return res.json({
            data: docs,
            message: getMessage('default.success'),
        });
    }
};

const update = async (req: Request, res: Response) => {
    const {
        title,
        description,
        wasUsed,
        variations,
        price,
        userId,
        active,
    }: IProduct = req.body;

    let docs: IProduct[] = [];

    const updateProperties = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(description && {
            description: { $regex: description, $options: 'i' },
        }),
        ...(wasUsed && { wasUsed }),
        ...(variations && { variations }),
        ...(price && { price }),
        ...(active && { active }),
    };

    Product.findByIdAndUpdate(userId, updateProperties)
        .then(result => {
            if (result) {
                return res.status(200).json({
                    data: { ...result },
                    message: getMessage('default.success'),
                });
            }
            return res.status(404).json({
                message: getMessage('default.notfound'),
            });
        })
        .catch(err => {
            return res.status(500).json({
                err: err,
                message: getMessage('default.serverError'),
            });
        });
};

const remove = async (req: Request, res: Response) => {
    const { _id } = req.params;

    try {
        const deletedDoc = await Product.findByIdAndRemove(_id);

        if (!deletedDoc) {
            return res
                .status(404)
                .json({ message: getMessage('default.notfound') });
        }

        return res.json({ message: getMessage('default.success') });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: getMessage('default.serverError') });
    }
};

export default { create, find, findOneById, update, remove };
