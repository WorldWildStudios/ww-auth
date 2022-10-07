import { users } from '../models/entities/Database.js';
export default {
    path: '/',
    method: 'GET',
    router: (logger) => {
        return (data = {}) => {
            return async (req, res) => {
                const usersR = await users.find();
                res.render('index', {
                    users: usersR
                });
            };
        };
    }
};
