import * as C from './styles';

const TableItem = ({ item }) => {

  // Função para calcular o peso total dos produtos
  // Função para calcular o peso total dos produtos
  // Função para calcular o peso total dos produtos e volumes detalhados
  const calcularPesoTotal = () => {
    let pesoTotal = 0;
    item.produtos.forEach(produto => {
      produto.volumesDetalhes.forEach(volumeDetalhe => {
        pesoTotal += volumeDetalhe.peso;
      });
    });
    return pesoTotal;
  };

  return (
    <C.TableLine>
      <C.TableColumn>{item.sigla}</C.TableColumn>
      <C.TableColumn>{item.codigoPedido}</C.TableColumn>
      <C.TableColumn>{item.codigoRastreio}</C.TableColumn>
      <C.TableColumn>{item.valorTransportadora}</C.TableColumn>
      <C.TableColumn>{item.valorDeclarado}</C.TableColumn>
      <C.TableColumn>{calcularPesoTotal()}</C.TableColumn>
    </C.TableLine>
  );
}

export default TableItem;