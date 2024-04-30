import arrayToCsv from 'arrays-to-csv';
import axios from 'axios';
import fs from 'fs';
import { gerarCSVCotacoes, recriarBancoDados } from '../helpers/utilsPedidos.js'
import { salvarPedidosRecalculados, gerarCSV } from '../repositories/pedidos.repository.js';


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

    recriarBancoDados();

    // Loop para buscar todas as páginas de pedidos e realizar novas cotações
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {

      console.log(totalPaginas)
      console.log(pagina)

      // Busca os pedidos da página atual
      const response = await buscarPedidosPorPagina(pagina);
      const todosPedidos = response.data.pedidos;

      // Realiza novas cotações para os pedidos da página atual
      const novasCotacoesPagina = await realizarNovasCotacoes(todosPedidos, siglasNovaCotacao);

      // Salva os pedidos recalculados no banco de dados após cada página
      await salvarPedidosRecalculados(novasCotacoesPagina);

      // // Concatena as novas cotações da página atual ao array geral de novas cotações
      // novasCotacoes = novasCotacoes.concat(novasCotacoesPagina);
    }

    //exportarDestinosEServicosComoCSV()
    gerarCSV()

    // // Converter o array de pedidos em uma string formatada
    // const pedidosString = JSON.stringify(novasCotacoes, null, 2);

    // // Escrever a string em um arquivo de texto
    // fs.writeFileSync('pedidos.json', pedidosString);

    // // Gerar CSV dos dados das Novas Cotações
    // gerarCSVCotacoes(novasCotacoes);

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
      const { cepOrigem, cepDestino, codigoPedido, dimensaoCalculo, valorDeclarado, produtos } = pedido;

      // Divide as siglas de cotação
      const tabChave = siglasNovaCotacao.split(',');

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
          const response = await axios.post('https://api-transporte.magazord.com.br/api/v1/calculoFreteAnalise', payload, { headers });
          response.data.codigoPedido = codigoPedido;
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
