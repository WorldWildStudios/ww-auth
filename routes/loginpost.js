import { users } from '../models/entities/Database.js';
import hash from '../structures/Hash.js';
export default {
    path: '/login',
    method: 'POST',
    router: async (req, res, logger, data = {}) => {
        const { user, password } = req.body;
        if (!user || !password) {
            res.status(400).json({
                error: 'All fields are required'
            });
            return;
        }
        const queries = [{ username: user }, { phone: user }, { email: user }];
        for (const query of queries) {
            let queried = await users.findOne({
                select: {
                    password: true,
                    id: true,
                },
                where: query
            });
            if (queried) {
                if (queried.password == hash(password)) {
                    //req.flash('success', 'Successfully logged in');
                    req.session['userId'] = queried.id;
                    req.session.save(err => {
                        if (err) {
                            logger.error(err, 'Express');
                        }
                    });
                    if ('redirectTo' in req.session) {
                        res.redirect(req.session['redirectTo']);
                        delete req.session['redirectTo'];
                        req.session.save((err) => {
                            if (err) {
                                logger.error(err, 'Express');
                            }
                        });
                        return;
                    }
                    res.status(200).json({
                        message: 'Success'
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
    }
};
