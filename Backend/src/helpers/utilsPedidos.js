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


