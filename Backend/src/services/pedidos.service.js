export const buscarPedidosFiltrados = async (identificador, sigla, dataInicio, dataFim) => {
  const pedidos = [];
  let totalPaginas = Infinity;

  try {
    let todosPedidos = [];
    let pagina = 1;
    const pedidosPorPagina = 50;

    while (pagina <= totalPaginas) {
      const headers = {
        "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        "https://api-transporte.magazord.com.br/api/rastreio/notaFiscal/pedidoCalculo",
        {
          headers: headers,
          params: {
            identificador: identificador,
            sigla: sigla,
            dataInicio: dataInicio,
            dataFim: dataFim,
            page: pagina,
            offset: pedidosPorPagina,
          },
        }
      );
      todosPedidos = [...todosPedidos, ...response.data.pedidos];
      if(pagina === 1) {
        totalPaginas = Math.ceil(response.data.quatidadeTotal / pedidosPorPagina);
      }
      pagina++;
      
      if (pagina > totalPaginas) { // Verificar se já passamos do número total de páginas
        break;
      }
    }

    return todosPedidos;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error; // Rejeita a promessa com o erro capturado
  }
}
