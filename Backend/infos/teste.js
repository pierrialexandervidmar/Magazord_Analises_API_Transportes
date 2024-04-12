const realizarNovasCotacoes = async (pedidos) => {
  const pedidosRecalculados = [];

  try {
    // Iterar sobre os pedidos
    for (const pedido of pedidos) {
      // Extrair os dados necessários
      const {
        cepOrigem,
        cepDestino,
        dimensaoCalculo,
        valorDeclarado,
        produtos,
      } = pedido;

      // Preencher a variável tabChave com os valores adequados
      const tabChave = ["BPS", "BAU"];

      // Iterar sobre cada valor em tabChave
      for (const chave of tabChave) {
        // Formatar os dados conforme necessário para enviar ao segundo endpoint
        const payload = {
          cepOrigem: cepOrigem,
          cepDestino: cepDestino,
          dimensaoCalculo: dimensaoCalculo,
          valorDeclarado: valorDeclarado,
          produtos: produtos,
          tabChave: chave // Alterado para o valor atual de tabChave
        };

        const headers = {
          "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230",
          "Content-Type": "application/json",
        };

        try {
          // Enviar os dados formatados para o segundo endpoint
          const response = await axios.post('https://api-transporte.magazord.com.br/api/v1/calculoFreteAnalise', payload, { headers });
          pedidosRecalculados.push(response.data);
        } catch (error) {
          console.log('Deu merda ao refazer cotações: ', error);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar pedidos:', error);
    // res.status(500).json({ error: 'Erro ao processar pedidos.' }); // O objeto `res` não está definido aqui
  }

  return pedidosRecalculados;
}