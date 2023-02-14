import { Router, Request, Response } from 'express';
import { getMessage } from '../utils/message.util';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    return res.json({ message: getMessage('default.helloWorld') });
});

export default routes;