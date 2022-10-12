export default {
    path: '/register',
    method: 'GET',
    router: (logger) => {
        return (data = {}) => {
            return async (req, res) => {
                res.render('register');
            };
        };
    }
};
