import {applications} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';

export default {
    path: '/apps',
    loginRequired: true,
    method: 'GET',
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        const apps = await applications.find();

        res.render('apps', {
            apps: apps
        });
    }
};