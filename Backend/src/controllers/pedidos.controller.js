import fs from 'fs';

import { cotacoesGerais } from '../repositories/pedidos.repository.js';
import { buscaCotacoesGerais, buscaCotacoesVencedoras, buscaCotacoesVencedorasQuantitativo, buscarPedidos } from '../services/pedidos.service.js'

export const getRefazCotacoes = async (req, res) => {
  const identificador = req.query.identificador;
  const siglasNovaCotacao = req.query.siglasNovaCotacao;
  const siglasTansportadorasWebservice = req.query.siglasTansportadorasWebservice || null;
  const tokenCliente = req.query.tokenCliente || null;
  const dataInicio = req.query.dataInicio;
  const dataFim = req.query.dataFim;
  // Sigla original é opcional, caso queiram recotar somente os pedidos de uma determinada
  // transporportadora do periodo com as siglas novas de cotações
  let siglaOriginal = req.query.siglaOriginal || null;

  console.log(identificador + ' ' + siglasNovaCotacao + ' ' + siglasTansportadorasWebservice + ' ' + tokenCliente + ' ' + dataInicio + ' ' + dataFim + ' ' + siglaOriginal)

  if (
    identificador?.trim() &&
    siglasNovaCotacao?.trim() &&
    dataInicio &&
    dataFim
  ) {
    try {
      const pedidos = await buscarPedidos(identificador, siglasNovaCotacao, dataInicio, dataFim, siglaOriginal = null, siglasTansportadorasWebservice, tokenCliente);

      res.status(200).json(pedidos);
    } catch (error) {
      res.status(400).send(error.message); // Enviar a mensagem de erro diretamente
    }
  } else {
    res.status(400).send("Todos os parâmetros são obrigatórios e devem ser válidos");
  }
}

export const getProgresso = async (req, res) => {
  const progresso = await buscarPaginaAtual();
  res.status(200).json(progresso);
}


export const getCotacoesGeraisDados = async (req, res) => {
  const cotacoesGeraisProntas = await buscaCotacoesGerais();
  res.status(200).json(cotacoesGeraisProntas);
}

export const getCotacoesVencedorasDados = async (req, res) => {
  const cotatcoesVencedorasProntas = await buscaCotacoesVencedoras();
  res.status(200).json(cotatcoesVencedorasProntas);
}

export const getCotacoesVencedorasQuantitativo = async (req, res) => {
  const cotacoesVencedorasQuantitativo = await buscaCotacoesVencedorasQuantitativo();
  res.status(200).json(cotacoesVencedorasQuantitativo);
}

