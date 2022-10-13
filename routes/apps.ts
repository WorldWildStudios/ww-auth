import {applications} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import RouteData from "../structures/RouteData";

export default {
    path: '/apps',
    loginRequired: true,
    method: 'GET',
    router: () => {
        return (data:RouteData={}) => {
            let { connectedUser } = data;
            return async (req: Request, res: Response) => {
                const apps = await applications.find();

                res.render('apps', {
                    apps: apps,
                    connectedUser
                });
            };
        };
    }
};