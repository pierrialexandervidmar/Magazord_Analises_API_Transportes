import { buscarPedidosFiltrados } from '../services/pedidos.service.js';

export const getPedidosFiltrados = async (req, res) => {
  const identificador = req.params.identificador;
  const sigla = req.params.sigla;
  const dataInicio = req.params.dataInicio;
  const dataFim = req.params.dataFim;

  if (
    identificador?.trim() && 
    sigla?.trim() && 
    dataInicio instanceof Date && 
    dataFim instanceof Date
  ) {
    try {
      const pedidos = await buscarPedidosFiltrados(identificador, sigla, dataInicio, dataFim);
      res.status(200).send(pedidos);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  } else {
    res.status(400).send({ error: "Todos os parâmetros são obrigatórios e devem ser válidos" });
  }
}

