import {DB, users} from '../models/entities/Database.js';
import {Response} from 'express';
import {Request} from '../index.js';
import Logger from '../structures/Logger.js';

export default {
    path: '/login',
    method: 'GET',
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        res.render('login');
    }
};