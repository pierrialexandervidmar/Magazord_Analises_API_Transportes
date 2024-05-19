import { getRefazCotacoes, getCotacoesVencedorasDados, getCotacoesGeraisDados, getCotacoesVencedorasQuantitativo } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/refazCotacoes", getRefazCotacoes);
    app.get("/cotacoesVencedorasQuantitativo", getCotacoesVencedorasQuantitativo);
    app.get("/cotacoesVencedorasDados", getCotacoesVencedorasDados);
    app.get("/cotacoesGeraisDados", getCotacoesGeraisDados);
};
