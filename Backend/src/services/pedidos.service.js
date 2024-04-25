import arrayToCsv from 'arrays-to-csv';
import axios from 'axios';
import fs from 'fs';
import { gerarCSVCotacoes } from '../helpers/utilsPedidos.js'
import { salvarPedidosRecalculados } from '../repositories/pedidos.repository.js';


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
export const buscarPedidos = async (identificador, siglasNovaCotacao, dataInicio, dataFim, siglaOriginal = null) => {
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

    const buscarPedidosPorPagina = async (pagina) => {
      const headers = {
        "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
        "Content-Type": "application/json",
      };

      return axios.get(
        "https://api-transporte.magazord.com.br/api/rastreio/notaFiscal/pedidoCalculo",
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

    // Loop para buscar todas as páginas
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {

      console.log(totalPaginas)
      console.log(pagina)

      const response = await buscarPedidosPorPagina(pagina);
      const todosPedidos = response.data.pedidos;
      const novasCotacoesPagina = await realizarNovasCotacoes(todosPedidos, siglasNovaCotacao);

      // const paginaString = JSON.stringify(novasCotacoesPagina, null, 2);
      // fs.writeFileSync('paginaString.json', paginaString);

      // Salva os pedidos recalculados no banco de dados após cada página
      await salvarPedidosRecalculados(novasCotacoesPagina);

      novasCotacoes = novasCotacoes.concat(novasCotacoesPagina);
    }

    // Converter o array de pedidos em uma string formatada
    const pedidosString = JSON.stringify(novasCotacoes, null, 2);

    // Escrever a string em um arquivo de texto
    fs.writeFileSync('pedidos.json', pedidosString);

    // Gerar CSV dos dados das Novas Cotações
    gerarCSVCotacoes(novasCotacoes);

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
const realizarNovasCotacoes = async (pedidos, siglasNovaCotacao) => {
  let pedidosRecalculados = [];

  try {
    for (let pedido of pedidos) {
      // Extrai os dados necessários do pedido
      const { cepOrigem, cepDestino, dimensaoCalculo, valorDeclarado, produtos } = pedido;

      // Divide as siglas de cotação
      const tabChave = siglasNovaCotacao.split(',');

      // Itera sobre as siglas de cotação
      for (let sigla of tabChave) {
        let payload = {
          cepOrigem,
          cepDestino,
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
          const response = await axios.post('https://api-transporte.magazord.com.br/api/v1/calculoFreteAnalise', payload, { headers });
          pedidosRecalculados.push(response.data);
        } catch (error) {
          console.log('Ocorreu um erro ao refazer cotações:', error);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar pedidos:', error);
  }

  return pedidosRecalculados;
};
