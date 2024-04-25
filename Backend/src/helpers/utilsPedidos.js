import fs from 'fs';
import axios from 'axios';
import { exec } from 'child_process';

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

export const recriarBancoDados = () => {
  try {
    // Excluir o banco de dados SQLite existente
    fs.unlinkSync('/home/pierri/Projetos/magazord/Magazord_Analises_API_Transportes/Backend/prisma/dev.db');
    console.log('Banco de dados SQLite excluído com sucesso.');

    // Executar as migrations do Prisma para criar o novo banco de dados
    exec('npx prisma migrate dev', async (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao aplicar as migrations do Prisma:', error);
        res.status(500).send('Erro ao aplicar as migrations do Prisma: ' + error.message);
        return;
      }

      console.log('Migrations do Prisma aplicadas com sucesso:', stdout);
      console.log('Novo banco de dados SQLite criado com sucesso.');

    });
  } catch (error) {
    console.error('Erro ao excluir o banco de dados SQLite:', error);
  }
}
