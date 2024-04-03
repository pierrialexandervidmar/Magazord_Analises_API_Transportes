const { buscarPedidosFiltrados } = require("../controllers/pedidos.controller");

exports.pedidosRoute = app => {
    app.get("/pedidosFiltrados", getPedidosFiltrados);
};