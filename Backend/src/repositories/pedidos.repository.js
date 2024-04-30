import { prisma } from "../services/prisma.js";
import { createObjectCsvWriter } from 'csv-writer';

export const salvarPedidosRecalculados = async (pedidosRecalculados) => {
  try {
    for (const pedido of pedidosRecalculados) {
      const destino = await prisma.destino.create({
        data: {
          nome: pedido.destino,
          codigoPedido: pedido.codigoPedido
        },
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
    { id: 'codigoPedido', title: 'Código do Pedido' },
    { id: 'nomeDestino', title: 'Nome do destino' },
    { id: 'codigoServico', title: 'Código do serviço' },
    { id: 'valor', title: 'Valor' },
    { id: 'prazoFinal', title: 'Prazo Final' }
  ]
});

export const gerarCSV = async () => {
  try {
    // Consulta SQL para obter os serviços com o menor valor para cada código de pedido
    const menorValorServicos = await prisma.$queryRaw`
      SELECT d.codigoPedido, s.codigo AS codigoServico, d.nome AS nomeDestino, s.valor, s.prazoFinal
      FROM Destino d
      JOIN Servico s ON d.id = s.destinoId
      WHERE (s.valor, d.id) IN (
        SELECT MIN(s.valor), s.destinoId
        FROM Servico s
        JOIN Destino d ON s.destinoId = d.id
        GROUP BY d.codigoPedido
      )
    `;

    // Formatar os dados para o formato esperado pelo CSV Writer
    const registrosCSV = menorValorServicos.map(servico => ({
      codigoPedido: servico.codigoPedido,
      nomeDestino: servico.nomeDestino,
      codigoServico: servico.codigoServico,
      valor: servico.valor,
      prazoFinal: servico.prazoFinal
    }));

    // Escrever os dados no arquivo CSV
    await csvWriter.writeRecords(registrosCSV);
    console.log('Arquivo CSV gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar o arquivo CSV:', error);
  } finally {
    // Fechar a conexão com o Prisma após a escrita dos dados no arquivo CSV
    await prisma.$disconnect();
  }
};
