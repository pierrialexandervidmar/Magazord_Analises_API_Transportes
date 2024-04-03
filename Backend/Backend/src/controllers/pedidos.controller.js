const { saleValidation, updateValidation } = require('../validations/sales.validation');
import { buscarPedidosFiltrados } from '../services/pedidos.service';


exports.getPedidosFiltrados = async (req, res) => {
  try {
      const users = await buscarPedidosFiltrados(req);
      res.status(200).send(users);
  } catch (error) {
      res.status(400).send({ error: error.message });
  }
}
