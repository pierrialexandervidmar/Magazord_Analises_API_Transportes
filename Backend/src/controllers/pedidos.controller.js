import { buscarPedidos } from '../services/pedidos.service.js'

// export const getPedidosFiltrados = async (req, res) => {
//   const identificador = req.query.identificador;
//   const sigla = req.query.sigla;
//   const dataInicio = req.query.dataInicio;
//   const dataFim = req.query.dataFim;

//   console.log(identificador + ' ' + sigla + ' ' + dataInicio + ' ' + dataFim)

//   if (
//     identificador?.trim() &&
//     sigla?.trim() &&
//     dataInicio &&
//     dataFim
//   ) {
//     try {
//       const pedidos = await buscarPedidosFiltrados(identificador, sigla, dataInicio, dataFim);

//       console.log('passei aqui')
//       res.status(200).send(pedidos);
//     } catch (error) {
//       res.status(400).send({ error: error.message });
//     }
//   } else {
//     res.status(400).send({ error: "Todos os parâmetros são obrigatórios e devem ser válidos" });
//   }
// }



export const getRefazCotacoes = async (req, res) => {
  const identificador = req.query.identificador;
  const siglasNovaCotacao = req.query.siglasNovaCotacao;
  const dataInicio = req.query.dataInicio;
  const dataFim = req.query.dataFim;
  // Sigla original é opcional, caso queiram recotar somente os pedidos de uma determinada
  // transporportadora do periodo com as siglas novas de cotações
  let siglaOriginal = req.query.siglaOriginal || null;

  console.log(identificador + ' ' + siglasNovaCotacao + ' ' + dataInicio + ' ' + dataFim + ' ' + siglaOriginal)

  if (
    identificador?.trim() &&
    siglasNovaCotacao?.trim() &&
    dataInicio &&
    dataFim
  ) {
    try {
      const pedidos = await buscarPedidos(identificador, siglasNovaCotacao, dataInicio, dataFim, siglaOriginal = null);

      res.status(200).json(pedidos);
    } catch (error) {
      res.status(400).send(error.message); // Enviar a mensagem de erro diretamente
    }
  } else {
    res.status(400).send("Todos os parâmetros são obrigatórios e devem ser válidos");
  }
}

