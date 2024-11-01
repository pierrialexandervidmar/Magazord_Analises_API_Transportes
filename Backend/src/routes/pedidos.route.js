import { getCotacoesGeraisDados, getCotacoesVencedorasDados, getCotacoesVencedorasQuantitativo, getProgresso, getRefazCotacoes } from '../controllers/pedidos.controller.js';

export const pedidosRoute = app => {
    app.get("/refazCotacoes", getRefazCotacoes);
    app.get("/cotacoesVencedorasQuantitativo", getCotacoesVencedorasQuantitativo);
    app.get("/cotacoesVencedorasDados", getCotacoesVencedorasDados);
    app.get("/cotacoesGeraisDados", getCotacoesGeraisDados);
    app.get("/progresso", getProgresso);
};
