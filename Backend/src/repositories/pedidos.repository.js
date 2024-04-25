import { prisma } from "../services/prisma.js";

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
