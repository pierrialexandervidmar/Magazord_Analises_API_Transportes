import { getPedidosFiltrados, getRefazCotacoes } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/pedidosFiltrados", getPedidosFiltrados); // DESCONTINUAR ESTE ROTA DEPOIS
    app.get("/refazCotacoes", getRefazCotacoes);
};
