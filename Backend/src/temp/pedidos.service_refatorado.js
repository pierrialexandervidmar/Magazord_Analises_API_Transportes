import axios from 'axios';
import fs from 'fs';

export const buscarPedidosFiltradosssss = async (identificador, sigla, dataInicio, dataFim) => {
  const pedidos = [];
  let totalPaginas = Infinity;

  try {
    const pedidosPorPagina = 50;
    const headers = {
      "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
      "Content-Type": "application/json",
    };

    // Função para fazer uma única requisição de pedidos por página
    const buscarPedidosPorPagina = async (pagina) => {
      return axios.get(
        "https://api-transporte.magazord.com.br/api/rastreio/notaFiscal/pedidoCalculo",
        {
          headers: headers,
          params: {
            identificador: identificador,
            sigla: sigla,
            dataInicio: dataInicio,
            dataFim: dataFim,
            page: pagina,
            offset: pedidosPorPagina,
          },
        }
      );
    };

    // Calcular o número total de páginas antes de fazer as requisições
    const primeiraResposta = await buscarPedidosPorPagina(1);
    totalPaginas = Math.ceil(primeiraResposta.data.totalPages);

    // Criar array de promessas para fazer todas as requisições em paralelo
    const promessas = [];
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      promessas.push(buscarPedidosPorPagina(pagina));
    }

    // Aguardar todas as requisições em paralelo
    const responses = await Promise.all(promessas);

    // Extrair os pedidos de todas as respostas
    const todosPedidos = responses.flatMap(response => response.data.pedidos);

    // Converter o array de pedidos em uma string formatada
    const pedidosString = JSON.stringify(todosPedidos, null, 2);

    // Escrever a string em um arquivo de texto
    fs.writeFileSync('pedidos.txt', pedidosString);

    return todosPedidos;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error; // Rejeita a promessa com o erro capturado
  }
}