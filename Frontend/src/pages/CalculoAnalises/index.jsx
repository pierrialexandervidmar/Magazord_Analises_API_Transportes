import React, { useEffect, useState } from "react";
import axios from "axios";
import InputArea from "./components/InputArea";

import * as C from "./styles";
import TableArea from "./components/TableArea";

function CalculoAnalises() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Alterado para iniciar como false
  const [error, setError] = useState(null); // Adicionado para lidar com erros
  const [consulted, setConsulted] = useState(false); // Adicionado para controlar se a consulta já foi realizada
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(null);

  

  const handleAddData = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        "zord-token": "26357d37471ee60fc037f0ebb1a81a01eba98230", // Substitua SEU_TOKEN pelo token real
        "Content-Type": "application/json", // Especifica o tipo de conteúdo da requisição
      };
      const response = await axios.get(
        "https://api-transporte.magazord.com.br/api/rastreio/notaFiscal/pedidoCalculo",
        {
          headers: headers,
          params: {
            ...params, // Use o spread operator para passar os parâmetros recebidos
            offset: 20,
            page: pageNumber,
          },
        }
      );
      setData(response.data);
      setConsulted(true);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao buscar dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <C.Container>
        <C.Body>
          <C.Title>
            <h3>Buscar Pedidos</h3>
          </C.Title>
          <InputArea onAdd={handleAddData} />
          {loading && <div>Carregando...</div>}
          {error && <div>{error}</div>}
          {data && <TableArea list={data} />}
        </C.Body>
      </C.Container>
    </div>
  );
}

export default CalculoAnalises;
