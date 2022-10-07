export default {
    path: '/login',
    method: 'GET',
    router: (logger) => {
        return (data = {}) => {
            return async (req, res) => {
                res.render('login');
            };
        };
    }
};
