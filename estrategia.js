const axios = require('axios');

async function processOrders() {
    const orders = await fetchOrders(); // Função para buscar pedidos por página
    const promises = orders.map(order => generateQuotation(order)); // Função para gerar cotação para cada pedido

    // Controlar o número máximo de requisições simultâneas
    const concurrencyLimit = 5;
    const results = await PromisePool
        .withConcurrency(concurrencyLimit)
        .addAll(promises);

    // Agregar resultados e processá-los conforme necessário
    results.forEach(result => {
        // Processar resultados
    });
}

async function fetchOrders() {
    // Exemplo de requisição com Axios para buscar pedidos
    const response = await axios.get('endpoint_para_pedidos');
    return response.data.orders;
}

async function generateQuotation(order) {
    try {
        // Exemplo de requisição com Axios para gerar cotação
        const response = await axios.get(`endpoint_para_cotacao/${order.id}`);
        return response.data.quotation;
    } catch (error) {
        console.error(`Erro ao gerar cotação para o pedido ${order.id}: ${error.message}`);
        throw error;
    }
}

processOrders();
