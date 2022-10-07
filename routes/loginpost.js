import { users } from '../models/entities/Database.js';
import hash from '../structures/Hash.js';
export default {
    path: '/login',
    method: 'POST',
    router: (logger) => {
        return (data = {}) => {
            return async (req, res) => {
                const { user, password } = req.body;
                if (!user || !password) {
                    res.status(400).json({
                        error: 'All fields are required'
                    });
                    return;
                }
                const queries = [{ username: user }, { phone: user }, { email: user }];
                for (const query of queries) {
                    let queryied = await users.findOne({
                        select: {
                            password: true
                        },
                        where: query
                    });
                    if (queryied) {
                        if (queryied.password == hash(password)) {
                            res.status(200).json({
                                error: 'Successfuly connected'
                            });
                            return;
                        }
                        res.status(501).json({
                            error: 'Wrong password'
                        });
                        return;
                    }
                }
                res.status(404).json({
                    error: 'User not found'
                });
                return;
            };
        };
    }
};
