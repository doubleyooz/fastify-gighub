import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import ProductMiddleware from '../middlewares/product.middleware';

const routes = Router();

routes.post('/products', ProductMiddleware.create, ProductController.create);
routes.get(
    '/products/:_id',
    ProductMiddleware.findById,
    ProductController.findOneById,
);
routes.get('/products', ProductMiddleware.find, ProductController.find);
routes.put(
    '/products/:_id',
    ProductMiddleware.update,
    ProductController.update,
);
routes.delete(
    '/products/:_id',
    ProductMiddleware.findById,
    ProductController.remove,
);

export default routes;
