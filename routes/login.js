export default {
    path: '/login',
    method: 'GET',
    router: async (req, res, logger, data = {}) => {
        res.render('login');
    }
};
