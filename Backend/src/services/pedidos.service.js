import arrayToCsv from 'arrays-to-csv';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

import { recriarBancoDados } from '../helpers/utilsPedidos.js'
import { cotacoesGerais, cotacoesVencedoras, cotacoesVencedorasQuantitativos, gerarCSV, gerarCSVGeral, salvarPedidosRecalculados } from '../repositories/pedidos.repository.js';

const URL_BASE_PROD = 'https://api-transporte.magazord.com.br'
const URL_BASE = 'https://api-transporte-staging.magazord.com.br'

/**
 * Busca pedidos com base nos parâmetros fornecidos.
 *
 * @param {string} identificador - O identificador dos pedidos.
 * @param {string} siglasNovaCotacao - As siglas das novas cotações, separadas por vírgula.
 * @param {string} dataInicio - A data de início para a busca dos pedidos.
 * @param {string} dataFim - A data de término para a busca dos pedidos.
 * @param {string} [siglaOriginal=null] - A sigla original, opcional.
 * @returns {Array} - Um array contendo os pedidos encontrados.
 */
export const buscarPedidos = async (identificador, siglasNovaCotacao, dataInicio, dataFim, siglaOriginal = null, siglasTansportadorasWebservice, tokenCliente) => {
  // Inicializações
  let totalPaginas = Infinity;
  let novasCotacoes = [];
  console.log('Iniciado, deus nos ajude');
  console.time("tempoRequisicao");

  try {
    // Constantes
    const pedidosPorPagina = 50;
    const headers = {
      "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
      "Content-Type": "application/json",
    };


    /**
     * Função para buscar pedidos por página.
     * @param {number} pagina - O número da página a ser buscada.
     * @returns {Promise} Uma Promise que retorna os dados da solicitação de busca de pedidos.
     */
    const buscarPedidosPorPagina = async (pagina) => {
      const headers = {
        "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
        "Content-Type": "application/json",
      };

      return axios.get(
        URL_BASE_PROD + "/api/rastreio/notaFiscal/pedidoCalculo",
        {
          headers: headers,
          params: {
            identificador,
            siglaOriginal,
            dataInicio,
            dataFim,
            page: pagina,
            offset: pedidosPorPagina,
          },
        }
      );
    };

    // Busca da primeira página
    const primeiraResposta = await buscarPedidosPorPagina(1);
    totalPaginas = Math.ceil(primeiraResposta.data.totalPages);

    recriarBancoDados();

    // Loop para buscar todas as páginas de pedidos e realizar novas cotações
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {

      console.log(totalPaginas)
      console.log(pagina)

      // Busca os pedidos da página atual
      const response = await buscarPedidosPorPagina(pagina);
      const todosPedidos = response.data.pedidos;

      // Realiza novas cotações para os pedidos da página atual
      const novasCotacoesPagina = await realizarNovasCotacoes(todosPedidos, siglasNovaCotacao, siglasTansportadorasWebservice, tokenCliente);

      // Salva os pedidos recalculados no banco de dados após cada página
      await salvarPedidosRecalculados(novasCotacoesPagina);
    }

    //exportarDestinosEServicosComoCSV()
    gerarCSV()
    gerarCSVGeral()

    console.timeEnd("tempoRequisicao");
    return novasCotacoes;

  } catch (error) {
    // Log de erro e lançamento do erro novamente
    const errorMessage = JSON.stringify(error);
    fs.writeFileSync('LogErro.json', errorMessage);
    throw error;
  }
}


/**
 * Realiza novas cotações para os pedidos fornecidos.
 *
 * @param {Array} pedidos - Os pedidos para os quais as novas cotações serão feitas.
 * @param {string} siglasNovaCotacao - As siglas das novas cotações, separadas por vírgula.
 * @returns {Array} - Um array contendo os pedidos recalculados.
 */
const realizarNovasCotacoes = async (pedidos, siglasNovaCotacao, siglasTansportadorasWebservice, tokenCliente) => {
  let pedidosRecalculados = [];

  try {
    for (let pedido of pedidos) {
      // Extrai os dados necessários do pedido
      const { cepOrigem, cepDestino, codigoPedido, dimensaoCalculo, valorDeclarado, produtos } = pedido;

      // Divide as siglas de cotação
      const tabChave = siglasNovaCotacao.split(',');
      let siglasWS = []

      if (siglasTansportadorasWebservice !== null) {
        siglasWS = siglasTansportadorasWebservice.split(',');
      }

      // Itera sobre as siglas de cotação
      for (let sigla of tabChave) {
        console.log(`Pedido: ${codigoPedido} - Sigla: ${sigla}`)
        let payload = {
          cepOrigem,
          cepDestino,
          codigoPedido,
          dimensaoCalculo,
          valorDeclarado,
          produtos,
          tabChave: [sigla]
        };

        const headers = {
          "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
          "Content-Type": "application/json",
        };

        // Envia os dados formatados para o segundo endpoint
        try {
          const response = await axios.post(URL_BASE + '/api/v1/calculoFreteAnalise', payload, { headers });
          response.data.codigoPedido = codigoPedido;
          pedidosRecalculados.push(response.data);
        } catch (error) {
          console.log('Ocorreu um erro ao refazer cotações:', error);
        }
      }

      if (siglasTansportadorasWebservice !== null && Array.isArray(siglasWS) && siglasWS.length > 0) {
        for (let siglaWS of siglasWS) {
          console.log(`Pedido: ${codigoPedido} - Sigla: ${siglaWS}`)
          let payload = {
            cepOrigem,
            cepDestino,
            codigoPedido,
            dimensaoCalculo,
            valorDeclarado,
            produtos,
            tabChave: [],
            cliente: tokenCliente,
            servicos: [siglaWS]
          };

          const headers = {
            "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
            "Content-Type": "application/json",
          };

          // Envia os dados formatados para o segundo endpoint
          try {
            const response = await axios.post(URL_BASE + '/api/v1/calculoFreteAnalise', payload, { headers });
            response.data.codigoPedido = codigoPedido;
            pedidosRecalculados.push(response.data);
          } catch (error) {
            console.log('Ocorreu um erro ao refazer cotações:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar pedidos:', error);
  }
  return pedidosRecalculados;
};

export const buscaCotacoesGerais = async () => {
  return await cotacoesGerais();
}

export const buscaCotacoesVencedoras = async () => {
  return await cotacoesVencedoras();
}

export const buscaCotacoesVencedorasQuantitativo = async () => {
  return await cotacoesVencedorasQuantitativos();
}


