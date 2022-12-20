import {DB, users} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/',
    method: 'GET',
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        const usersR = await users.find();

        res.render('index', {
            users: usersR
        });
    }
};