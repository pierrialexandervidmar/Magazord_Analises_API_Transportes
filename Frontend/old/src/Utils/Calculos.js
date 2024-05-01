const valoresPreparados = (resultados) => {
    const allResults = [].concat(...resultados);
    const valoresFrete = allResults.map(resultado => resultado.valor);
    const valoresOrdenados = valoresFrete.sort((a, b) => a - b);

    return valoresOrdenados;
}

const prazosPreparados = (resultados) => {
    const allResults = [].concat(...resultados);
    const valoresFrete = allResults.map(resultado => resultado.prazoFinal);
    const valoresOrdenados = valoresFrete.sort((a, b) => a - b);

    return valoresOrdenados;
}

export const retornaQuantidadeCotacoes = (resultados) => {
    const allResults = [].concat(...resultados);
    return allResults.length;
}

/**
 * Retorna a quantidade de transportadoras captadas
 * @param {*} resultados 
 * @returns 
 */
export const retornaQuantidadeTransportadorasCotadas = (resultados) => {
    const allResults = [].concat(...resultados.flat());

    const result = allResults.reduce((acumulador, item) => {
        const { codigo, quantidade } = item;
        if (acumulador[codigo]) {
            acumulador[codigo] += quantidade;
        } else {
            acumulador[codigo] = quantidade;
        }

        return acumulador;
    }, {});

    // Obtemos o número de chaves (códigos) no objeto acumulador
    const quantidadeUnicaTransportadoras = Object.keys(result).length;

    return quantidadeUnicaTransportadoras;
}

/**
 * Retorna um objeto com todas as siglas captadas na cotação
 * @param {*} resultados 
 * @returns 
 */
export const retornaListaTransportadorasCotadas = (resultados) => {
    const allResults = [].concat(...resultados.flat());

    const result = allResults.reduce((acumulador, item) => {
        const { codigo, quantidade } = item;
        if (acumulador[codigo]) {
            acumulador[codigo] += quantidade;
        } else {
            acumulador[codigo] = quantidade;
        }

        return acumulador;
    }, {});

    return result;
}

export const calculaMediaMenoresValoresFrete = (resultados) => {
    const menor = retornaMenorValor(resultados)
    const segundo = retornaSegundoMenorValor(resultados)
    const media = (menor + segundo) / 2;

    return media;
}

export const calculaDiferencaMenoresValoresFrete = (resultados) => {
    const menor = retornaMenorValor(resultados)
    const segundo = retornaSegundoMenorValor(resultados)
    const diferenca = segundo - menor;

    return diferenca;
}

export const retornaMenorValor = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = valoresOrdenados[0];

    return menor;
}


export const retornaSegundoMenorValor = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = valoresOrdenados[0];
    
    // Filtrar valores iguais ao menor
    const valoresDiferentesDoMenor = valoresOrdenados.filter(valor => valor !== menor);

    // Encontrar o segundo menor valor
    const segundo = valoresDiferentesDoMenor[0];

    return segundo;
}


export const retornaMenorPrazo = (resultados) => {
    const valoresOrdenados = prazosPreparados(resultados);
    const menor = valoresOrdenados[0];

    return menor;
}

export const retornaSegundoMenorPrazo = (resultados) => {
    const valoresOrdenados = prazosPreparados(resultados);
    const menor = valoresOrdenados[0];

    // Filtrar valores iguais ao menor
    const valoresDiferentesDoMenor = valoresOrdenados.filter(valor => valor !== menor);

    // Encontrar o segundo menor valor
    const segundo = valoresDiferentesDoMenor[0];

    return segundo;
}


export const calculaDiferencaMenoresPrazos = (resultados) => {
    const menor = retornaMenorPrazo(resultados)
    const segundo = retornaSegundoMenorPrazo(resultados)
    const diferenca = segundo - menor;

    return diferenca;
}


export const retornaTransportadoraMaisCotada = (resultados) => {
    const allResults = [].concat(...resultados.flat());

    const result = allResults.reduce((acumulador, item) => {
        const { codigo } = item;

        if (acumulador[codigo] === undefined) {
            acumulador[codigo] = 1;
        } else {
            acumulador[codigo]++;
        }

        return acumulador;
    }, {});

    let codigoMaisCotado;
    let contagemMaisCotada = 0;

    for (const codigo in result) {
        if (result.hasOwnProperty(codigo)) {
            const contagemCotada = result[codigo];
            if (contagemCotada > contagemMaisCotada) {
                codigoMaisCotado = codigo;
                contagemMaisCotada = contagemCotada;
            }
        }
    }

    return {
        codigoMaisCotado,
        contagemMaisCotada
    };
};


export const calculaMediaValorTransportadoraMaisCotada = (resultados) => {
    const transportadoraMaisCotada = retornaTransportadoraMaisCotada(resultados);
    const codigoMaisCotado = transportadoraMaisCotada.codigoMaisCotado;

    const valoresFiltrados = [].concat(...resultados.flat())
        .filter(resultado => resultado.codigo === codigoMaisCotado)
        .map(resultado => resultado.valor);

    if (valoresFiltrados.length === 0) {
        return 0;
    }

    const somaValores = valoresFiltrados.reduce((total, valor) => total + valor, 0);
    const media = somaValores / valoresFiltrados.length;

    return media;
}

export const calculaMediaOpcoesFreteCliente = (resultados) => {
    // Inicializar variáveis para contar a quantidade total de arrays e objetos
    let totalArrays = 0;
    let totalObjetos = 0;

    // Iterar sobre os resultados para contar a quantidade total de arrays e objetos
    resultados.forEach((arraysDeObjetos) => {
        totalArrays++;
        totalObjetos += arraysDeObjetos.length;
    });

    // Calcular a média
    const media = totalObjetos / totalArrays;

    return media;
}
