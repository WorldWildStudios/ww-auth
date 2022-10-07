import {DB, users} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/',
    method: 'GET',
    router: (logger: Logger) => {
        return (data={}) => {
            return async (req: Request, res: Response) => {
                const usersR = await users.find();

                res.render('index', {
                    users: usersR
                });
            };
        };
    }
};