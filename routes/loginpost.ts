import {users} from '../models/entities/Database.js';
import hash from '../structures/Hash.js';
import {Response} from 'express';
import {Request} from '../index.js';
import Logger from '../structures/Logger.js';

export default {
    path: '/login',
    method: 'POST',
    router: (logger: Logger) => {
        return () => {
            return async (req: Request, res: Response) => {
                const {user, password } = req.body;
                if(!user || !password) {
                    res.status(400).json({
                        error: 'All fields are required'
                    });
                    return;
                }
                const queries = [{username: user}, {phone: user}, {email: user}];
                for(const query of queries) {
                    let queried = await users.findOne({
                        select: {
                            id: true,
                            password: true
                        },
                        where: query
                    });
                    if(queried) {
                        if(queried.password==hash(password)) {
                            req.session['userId'] = queried.id;
                            let redirect_url: string;
                            if(!req.session.redirectTo) {
                               redirect_url = '/';
                            } else {
                                redirect_url = req.session.redirectTo as string;
                                delete req.session.redirectTo;
                            }

                            req.session.save((err) => {
                                if(err) {
                                    logger.error(err, 'Express-Sessions');
                                } else {
                                    res.redirect(redirect_url);
                                }
                            });
                            return;
                        }
                        res.status(501).json({
                            message: 'Wrong password'
                        });
                        return;
                    }
                }
                res.status(404).json({
                    message: 'User not found'
                });
                return;

            };
        };
    }
};