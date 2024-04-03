import { useState } from 'react';
import * as C from './styles';

const InputArea = ({ onAdd }) => { // Recebendo onAdd como uma propriedade
  const [identificadorField, setIdentificadorField] = useState(''); 
  const [siglaField, setSiglaField] = useState('');
  const [dataInicioField, setDataInicioField] = useState('');
  const [dataFimField, setDataFimField] = useState('');

  const handleAddEvent = () => {
    onAdd({ // Chamando a função onAdd e passando os dados preenchidos
      identificador: identificadorField,
      sigla: siglaField,
      dataInicio: dataInicioField,
      dataFim: dataFimField
    });
  }

  return (
    <C.Container>
      <C.InputLabel>
        <C.InputTitle>Identificador</C.InputTitle>
        <C.Input type="text" value={identificadorField} onChange={e => setIdentificadorField(e.target.value)} />
      </C.InputLabel>
      <C.InputLabel>
        <C.InputTitle>Sigla</C.InputTitle>
        <C.Input type="text" value={siglaField} onChange={e => setSiglaField(e.target.value)} />
      </C.InputLabel>
      <C.InputLabel>
        <C.InputTitle>Data Início</C.InputTitle>
        <C.Input type="date" value={dataInicioField} onChange={e => setDataInicioField(e.target.value)} />
      </C.InputLabel>
      <C.InputLabel>
        <C.InputTitle>Data Fim</C.InputTitle>
        <C.Input type="date" value={dataFimField} onChange={e => setDataFimField(e.target.value)} />
      </C.InputLabel>
      <C.InputLabel>
        <C.InputTitle>&nbsp;</C.InputTitle>
        <C.Button onClick={handleAddEvent}>Consultar</C.Button>
      </C.InputLabel>
    </C.Container>
  );
}

export default InputArea;