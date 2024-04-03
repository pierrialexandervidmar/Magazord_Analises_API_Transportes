const { buscarPedidosFiltrados } = require('../services/pedidos.service');


exports.getPedidosFiltrados = async (req, res) => {

  const identificador = req.params.identificador;
  const sigla = req.params.sigla;
  const dataInicio = req.params.dataInicio;
  const dataFim = req.params.dataFim;

  if(identificador != null, sigla != null, dataInicio != null, dataFim != Null) {
    try {
        const pedidos = await buscarPedidosFiltrados(req);
        res.status(200).send(pedidos);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
  }
}
