import { users } from '../models/entities/Database.js';
export default {
    path: '/',
    method: 'GET',
    router: async (req, res, logger, data = {}) => {
        const usersR = await users.find();
        res.render('index', {
            users: usersR
        });
    }
};
