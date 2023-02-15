import { Router } from 'express';
import ProductController from '../controllers/product.controller';

const routes = Router();

routes.post('/products', ProductController.create);
routes.get('/products/:_id', ProductController.findOneById);
routes.get('/products', ProductController.find);
routes.put('/products', ProductController.update);
routes.delete('/products', ProductController.remove);

export default routes;
