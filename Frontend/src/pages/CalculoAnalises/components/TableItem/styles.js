import styled from 'styled-components';

export const TableLine = styled.tr`

`;

export const TableColumn = styled.td`
  padding: 10px 0; 
`;

export const Category = styled.div`
  display: inline-block;
  padding: 0px 10px;
  border-radius: 5px;
  color: #FFF;
  background-color: ${props => props.color ? `${props.color}` : 'black'};
`;

export const Value = styled.div`
  color: ${props => props.color};
`;