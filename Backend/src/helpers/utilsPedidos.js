import fs from 'fs';
import axios from 'axios';

export const gerarCSVCotacoes = (novasCotacoes) => {
  // Extrair apenas as informações necessárias do destino e do serviço (código e valor)
  const novoObjeto = novasCotacoes.map(cotacao => {
    return {
      destino: cotacao.destino,
      servicos: cotacao.servicos.map(servico => {
        return {
          codigo: servico.codigo,
          valor: servico.valor
        };
      })
    };
  });

  // Converter o novo objeto em uma string formatada
  const novoObjetoString = JSON.stringify(novoObjeto, null, 2);
  // Escrever a string em um arquivo de texto
  fs.writeFileSync('novoObjeto.json', novoObjetoString);
};

// Função para buscar pedidos por página
export const buscarPedidosPorPagina = async (identificador, siglaOriginal, dataInicio, dataFim, pagina, pedidosPorPagina) => {
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
