import { prisma } from "../services/prisma.js";
import { createObjectCsvWriter } from 'csv-writer';

export const salvarPedidosRecalculados = async (pedidosRecalculados) => {
  try {
    for (const pedido of pedidosRecalculados) {
      const destino = await prisma.destino.create({
        data: { nome: pedido.destino },
      });

      for (const servico of pedido.servicos) {
        const novoServico = await prisma.servico.create({
          data: {
            codigo: servico.codigo,
            valor: servico.valor,
            prazo: servico.prazo,
            prazoFinal: servico.prazoFinal,
            destino: { connect: { id: destino.id } },
          },
        });

        // Converta o array de objetos detalhes em uma string JSON
        const detalhesString = JSON.stringify(servico.detalhes);

        // Crie um novo registro de ServicoDetalhe com os detalhes armazenados como uma string
        await prisma.servicoDetalhe.create({
          data: {
            detalhes: detalhesString,
            servico: { connect: { id: novoServico.id } },
          },
        });
      }
    }
  } catch (error) {
    console.error('Erro ao salvar pedidos recalculados no banco de dados:', error);
    throw error;
  }
};


// Crie uma instância do objeto CSV Writer e defina o cabeçalho do CSV
const csvWriter = createObjectCsvWriter({
  path: 'destinos_e_servicos.csv',
  header: [
      { id: 'nomeDestino', title: 'Nome do destino' },
      { id: 'codigoServico', title: 'Código do serviço' },
      { id: 'valor', title: 'Valor' },
      { id: 'prazoFinal', title: 'Prazo Final' }
  ]
});

export const gerarCSV = async () => {
  try {
      // Consulta os destinos e serviços relacionados usando o Prisma
      const destinosEServicos = await prisma.destino.findMany({
          include: {
              servicos: true
          }
      });

      // Formate os dados para o formato esperado pelo CSV Writer
      const registrosCSV = destinosEServicos.flatMap(destino => {
          return destino.servicos.map(servico => {
              return {
                  nomeDestino: destino.nome,
                  codigoServico: servico.codigo,
                  valor: servico.valor,
                  prazoFinal: servico.prazoFinal
              };
          });
      });

      // Escreva os dados no arquivo CSV
      await csvWriter.writeRecords(registrosCSV);
      console.log('Arquivo CSV gerado com sucesso');
  } catch (error) {
      console.error('Erro ao gerar o arquivo CSV:', error);
  } finally {
      // Feche a conexão com o Prisma após a escrita dos dados no arquivo CSV
      await prisma.$disconnect();
  }
};