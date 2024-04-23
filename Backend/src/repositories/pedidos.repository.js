import { prisma } from "../services/prisma.js";

export const salvarPedidosRecalculados = async (pedidosRecalculados) => {
  try {
    // Itera sobre os pedidos recalculados e os insere no banco de dados
    for (const pedido of pedidosRecalculados) {
      await prisma.pedidoRecalculado.create({
        data: {
          cepOrigem: pedido.cepOrigem,
          cepDestino: pedido.cepDestino,
          // Preencha os campos conforme necessário
        },
      });
    }
  } catch (error) {
    console.error('Erro ao salvar pedidos recalculados no banco de dados:', error);
    throw error;
  }
};