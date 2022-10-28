import {applications} from '../models/entities/Database.js';
import {Request, Response} from 'express';
import Logger from '../structures/Logger.js';
import Applications from "../models/entities/Applications.js";

export default {
    path: '/registerapp',
    method: 'POST',
    router: async (req: Request, res: Response, logger: Logger, data={}) => {
        const form = req.body;
        if(!form.name || !form.redirect || !form.postReceive) {
            res.status(400).json({
                message: 'All fields are required'
            });
            return;
        }
        const app = await applications.findOne({
            select: {
                id: true
            },
            where: {
                name: form.name
            }
        });
        if(app) {
            res.status(400).json({
                message: 'Application with that name already exists'
            });
            return;
        }
        const urlRegExp = new RegExp('(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})');// protocol
        if(!urlRegExp.test(form.redirect)) {
            res.status(400).json({
                message: 'Invalid redirect URL'
            });
            return;
        }
        if(!urlRegExp.test(form.postReceive)) {
            res.status(400).json({
                message: 'Invalid postReceive URL'
            });
            return;
        }
        const newApp= new Applications();
        newApp.name = form.name;
        newApp.redirect = form.redirect;
        newApp.postReceive = form.postReceive;
        await applications.save(newApp);
        res.status(200).json({
            message: 'Application created'
        });
    }
};