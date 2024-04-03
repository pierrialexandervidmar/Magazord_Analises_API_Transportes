const { login } = require('../controllers/auth.controller');

exports.authRoutes = app => {
    app.post("/login", login);
}