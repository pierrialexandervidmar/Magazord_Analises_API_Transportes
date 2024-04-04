import { getPedidosFiltrados } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/pedidosFiltrados", getPedidosFiltrados);
};
