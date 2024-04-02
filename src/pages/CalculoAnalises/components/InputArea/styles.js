import styled from 'styled-components';

export const Container = styled.div`
    background-color: #FFF;
    box-shadow: 0px 0px 5px #CCC;
    border-radius: 10px;
    padding: 5px 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
`;
export const InputLabel = styled.label`
    flex: 1;
    margin: 10px;
`;
export const InputTitle = styled.div`
    margin-bottom: 5px;
`;
export const Input = styled.input`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid lightblue;
    border-radius: 5px;

        /* Adiciona o efeito de borda quando o input está em foco */
        &:focus {
        border-color: blue;
        outline: none; /* Remove a borda padrão do navegador */
        box-shadow: 0 0 5px rgba(0, 0, 255, 0.2); /* Adiciona uma sombra para destacar o input */
    }
`;

export const Button = styled.button`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: none;
    border-radius: 5px;
    background-color: blue;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #0505B6;
        color: white;
    }
`;