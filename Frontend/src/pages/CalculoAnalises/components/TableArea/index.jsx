import TableItem from '../TableItem';
import * as C from './styles'

const TableArea = ({ list }) => {
  return (
    <C.Table>
      <thead>
        <tr>
          <C.TableHeadColumn>Sigla</C.TableHeadColumn>
          <C.TableHeadColumn>Pedido</C.TableHeadColumn>
          <C.TableHeadColumn>Rastreio</C.TableHeadColumn>
          <C.TableHeadColumn>Valor Transportadora</C.TableHeadColumn>
          <C.TableHeadColumn>Valor Declarado</C.TableHeadColumn>
          <C.TableHeadColumn>Peso Total</C.TableHeadColumn>
        </tr>
      </thead>
      <tbody>
        {list.pedidos.map((pedido, index) => (
          <TableItem key={index} item={pedido}/>
        ))}
      </tbody>
    </C.Table>
  )
}

export default TableArea;