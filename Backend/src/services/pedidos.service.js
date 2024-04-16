import axios from 'axios';
import fs from 'fs';
import arrayToCsv from 'arrays-to-csv';

export const buscarPedidosFiltrados = async (identificador, sigla, dataInicio, dataFim) => {
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
    console.log('O número total de pedidos é: ' + todosPedidos.length)

    // Converter o array de pedidos em uma string formatada
    const pedidosString = JSON.stringify(todosPedidos, null, 2);

    // Escrever a string em um arquivo de texto
    fs.writeFileSync('pedidos.txt', pedidosString);

    return todosPedidos;
  } catch (error) {
    const deuMerda = JSON.stringify(error);
    fs.writeFileSync('LogErro.json', deuMerda);
    throw error; // Rejeita a promessa com o erro capturado
  }
}


export const buscarPedidos = async (identificador, siglasNovaCotacao, dataInicio, dataFim, siglaOriginal = null) => {
  let totalPaginas = Infinity;
  let todosPedidosRecalculados = [];
  let novasCotacoes = [];
  console.log('Iniciado, deus nos ajude');
  console.time("tempoRequisicao");

  try {
    const pedidosPorPagina = 50;
    const headers = {
      "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
      "Content-Type": "application/json",
    };

    const buscarPedidosPorPagina = async (pagina) => {
      return axios.get(
        "https://api-transporte.magazord.com.br/api/rastreio/notaFiscal/pedidoCalculo",
        {
          headers: headers,
          params: {
            identificador: identificador,
            siglaOriginal: siglaOriginal,
            dataInicio: dataInicio,
            dataFim: dataFim,
            page: pagina,
            offset: pedidosPorPagina,
          },
        }
      );
    };

    const primeiraResposta = await buscarPedidosPorPagina(1);
    totalPaginas = Math.ceil(primeiraResposta.data.totalPages);

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      const pedidos = [];
      pedidos.push(buscarPedidosPorPagina(pagina));
      console.log(totalPaginas)
      console.log(pagina)

      const responses = await Promise.all(pedidos);
      const todosPedidos = responses.flatMap(response => response.data.pedidos);

      novasCotacoes.push(...await realizarNovasCotacoes(todosPedidos, siglasNovaCotacao));
    }

    // // Converter o array de pedidos em uma string formatada
    const pedidosString = JSON.stringify(novasCotacoes, null, 2);

    // // Escrever a string em um arquivo de texto
    fs.writeFileSync('pedidos.json', pedidosString);
    
    console.timeEnd("tempoRequisicao");
    return novasCotacoes;

  } catch (error) {
    const deuMerda = JSON.stringify(error);
    fs.writeFileSync('LogErro.json', deuMerda);
    throw error;
  }
}



const realizarNovasCotacoes = async (pedidos, siglasNovaCotacao) => {
  let pedidosRecalculados = [];

  try {
    // Iterar sobre os pedidos
    for (let pedido of pedidos) {
      // Extrair os dados necessários
      const {
        cepOrigem,
        cepDestino,
        dimensaoCalculo,
        valorDeclarado,
        produtos,
      } = pedido;

      // TRATAR SIGLAS DE COTAÇÕES CASO TENHAM, SIGLAS INVÁLIDAS, QUEBRAR NOS ARRAYS E PASSAR PARA TABCHAVES
      //
      //

      // Preencher a variável tabChave com os valores adequados
      const tabChave = siglasNovaCotacao.split(',');

      for (let sigla of tabChave) {
        console.log(sigla)

        let payload = {
          cepOrigem: cepOrigem,
          cepDestino: cepDestino,
          dimensaoCalculo: dimensaoCalculo,
          valorDeclarado: valorDeclarado,
          produtos: produtos,
          tabChave: [sigla]
        };

        const headers = {
          "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
          "Content-Type": "application/json",
        };

        // Enviar os dados formatados para o segundo endpoint
        const response = await axios.post('https://api-transporte.magazord.com.br/api/v1/calculoFreteAnalise', payload, { headers })
          .then(response => {
            pedidosRecalculados.push(response.data);
          })
          .catch(error => {
            console.log('Deu merda ao refazer cotações: ', error);
          });
      }
    }
  } catch (error) {
    console.error('Erro ao processar pedidos:', error);
  }

  return pedidosRecalculados;
}




