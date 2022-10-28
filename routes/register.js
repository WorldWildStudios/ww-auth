export default {
    path: '/register',
    method: 'GET',
    router: async (req, res, logger, data = {}) => {
        res.render('register');
    }
};
