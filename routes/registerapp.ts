import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/registerapp',
    method: 'GET',
    loginRequired: true,
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        res.render('registerapp');
    }
};