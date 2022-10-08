import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/registerapp',
    method: 'GET',
    router: (logger: Logger) => {
        return (data={}) => {
            return async (req: Request, res: Response) => {
                res.render('registerapp');
            };
        };
    }
};