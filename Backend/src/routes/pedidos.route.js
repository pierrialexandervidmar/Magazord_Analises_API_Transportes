import { getRefazCotacoes } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/refazCotacoes", getRefazCotacoes);
};
