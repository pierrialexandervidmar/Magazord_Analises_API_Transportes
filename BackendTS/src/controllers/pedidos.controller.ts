import { buscarPedidosFiltrados } from '../services/pedidos.service.js';

export const getPedidosFiltrados = async (req, res) => {
  const identificador = req.query.identificador;
  const sigla = req.query.sigla;
  const dataInicio = req.query.dataInicio;
  const dataFim = req.query.dataFim;

  if (
    identificador?.trim() && 
    sigla?.trim() && 
    dataInicio && 
    dataFim
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
