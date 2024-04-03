import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(Infinity);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarTodosPedidos = async () => {
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
                identificador: 'casaferrari',
                sigla: 'GFL',
                dataInicio: '2024-01-01',
                dataFim: '2024-01-30',
                page: pagina,
                offset: pedidosPorPagina,
              },
            }
          );
          todosPedidos = [...todosPedidos, ...response.data.pedidos];
          if(pagina === 1) {
            setTotalPaginas(Math.ceil(response.data.quatidadeTotal / pedidosPorPagina));
          }
          pagina++;
          
          if (pagina > totalPaginas) { // Verificar se já passamos do número total de páginas
            break;
          }
        }

        setPedidos(todosPedidos);
        setCarregando(false); // Indica que a carga foi concluída
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setCarregando(false); // Indica que ocorreu um erro ao carregar
      }
    };

    carregarTodosPedidos();
  }, []); // useEffect será executado apenas uma vez no início

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {pedidos.map(pedido => (
            <li key={pedido.codigoPedido}>{pedido.codigoPedido}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
