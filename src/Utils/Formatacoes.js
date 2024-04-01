export const formatarData = (data) => {
    const dataUtc = new Date(data + 'T00:00:00Z'); // Adiciona o UTC para garantir consistência
    return dataUtc.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export const formatarMoeda = (valor) => {
    return parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}