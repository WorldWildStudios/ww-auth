import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/register',
    method: 'GET',
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        res.render('register');
    }
};