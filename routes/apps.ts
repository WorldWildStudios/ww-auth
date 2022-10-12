import {users, applications} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/apps',
    loginRequired: true,
    method: 'GET',
    router: (logger: Logger) => {
        return (data={}) => {
            return async (req: Request, res: Response) => {
                const apps = await applications.find();

                res.render('apps', {
                    apps: apps
                });
            };
        };
    }
};