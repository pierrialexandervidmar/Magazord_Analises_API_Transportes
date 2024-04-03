const { userRoutes } = require("./user.route");
const { authRoutes } = require("./auth.route");
const { saleRoutes } = require("./sales.route");
const { pedidosRoute } = require('./pedidos.route');

module.exports = (app) => {
    userRoutes(app);
    authRoutes(app);
    saleRoutes(app);
    pedidosRoute(app);
};