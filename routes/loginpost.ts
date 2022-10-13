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
                            password: true
                        },
                        where: query
                    });
                    if(queried) {
                        if(queried.password==hash(password)) {
                            //req.flash('success', 'Successfully logged in');
                            logger.debug(JSON.stringify(req.session), 'DEVDEBUG');
                            if(!req.session.redirectTo) {
                                res.redirect('/');
                            } else {
                                const redirect = req.session.redirectTo as string;
                                delete req.session.redirectTo;
                                req.session.userId = queried.id;
                                req.session.save((err) => {
                                    if(err) {
                                        logger.error(err, 'Express');
                                    }
                                });
                                res.redirect(redirect);
                            }
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