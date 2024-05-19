import { getRefazCotacoes, getCotacoesVencedorasDados, getCotacoesGeraisDados } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/refazCotacoes", getRefazCotacoes);
    app.get("/cotacoesVencedorasDados", getCotacoesVencedorasDados);
    app.get("/cotacoesGeraisDados", getCotacoesGeraisDados);
};
