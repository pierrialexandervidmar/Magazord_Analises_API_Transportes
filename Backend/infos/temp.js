const axios = require('axios');

const app = express();
app.use(express.json());

// Rota para receber o primeiro payload e enviar para o segundo endpoint
app.post('/processar-pedidos', async (req, res) => {
  try {
    // Extrair dados do payload recebido
    const { pedidos } = req.body;

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

      // Formatar os dados conforme necessário para enviar ao segundo endpoint
      const dataParaEnviar = {
        cepOrigem,
        cepDestino,
        dimensaoCalculo,
        valorDeclarado,
        produtos,
        tabChave: ["BPS", "BAU"],
      };

      // Enviar os dados formatados para o segundo endpoint
      const response = await axios.post('SEGUNDO_ENDPOINT_URL', dataParaEnviar);

      // Manipular a resposta do segundo endpoint conforme necessário
      console.log('Resposta do segundo endpoint:', response.data);
    }

    res.status(200).json({ message: 'Pedidos processados com sucesso.' });
  } catch (error) {
    console.error('Erro ao processar pedidos:', error);
    res.status(500).json({ error: 'Erro ao processar pedidos.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});