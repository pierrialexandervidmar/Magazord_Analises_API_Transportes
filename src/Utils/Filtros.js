import * as Calculos from './Calculos'

export const retornaNomeTransportadoraMaisBarata = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const menorValor = Calculos.retornaMenorValor(resultados);
    const transportadoraMaisBarata = allResults.find(resultado => resultado.valor === menorValor);

    return transportadoraMaisBarata ? transportadoraMaisBarata.codigo : null;
}

export const retornaNomeSegundaTransportadoraMaisBarata = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const segundoMenorValor = Calculos.retornaSegundoMenorValor(resultados);
    const transportadoraMaisBarata = allResults.find(resultado => resultado.valor === segundoMenorValor);

    return transportadoraMaisBarata ? transportadoraMaisBarata.codigo : null;
}

export const retornaNomeTransportadoraMaisRapida = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const menorPrazo = Calculos.retornaMenorPrazo(resultados);
    const transportadoraMaisRapida = allResults.find(resultado => resultado.prazoFinal === menorPrazo);

    return transportadoraMaisRapida ? transportadoraMaisRapida.codigo : null;
}

export const retornaNomeSegundaTransportadoraMaisRapida = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const menorPrazo = Calculos.retornaSegundoMenorPrazo(resultados);
    const transportadoraMaisRapida = allResults.find(resultado => resultado.prazoFinal === menorPrazo);

    return transportadoraMaisRapida ? transportadoraMaisRapida.codigo : null;
}