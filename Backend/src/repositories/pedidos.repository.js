import { createObjectCsvWriter } from 'csv-writer';
import { writeFile } from 'fs/promises';

import { formatarValor } from '../helpers/utilsPedidos.js'
import { prisma } from "../services/prisma.js";

export const salvarPedidosRecalculados = async (pedidosRecalculados) => {
  try {
    for (const pedido of pedidosRecalculados) {

      const localidade = pedido.destino;
      const [cidade, uf] = localidade.split("/");

      const destino = await prisma.destino.create({
        data: {
          cidade: cidade,
          uf: uf,
          codigoPedido: pedido.codigoPedido
        },
      });

      for (const servico of pedido.servicos) {
        const novoServico = await prisma.servico.create({
          data: {
            codigo: servico.codigo,
            valor: formatarValor(servico.valor),
            prazo: parseInt(servico.prazo ?? 1, 10),
            prazoFinal: parseInt(servico.prazoFinal ?? 1, 10),
            destino: { connect: { id: destino.id } },
          },
        });

        // Converta o array de objetos detalhes em uma string JSON
        const detalhesString = JSON.stringify(servico.detalhes);

        // Crie um novo registro de ServicoDetalhe com os detalhes armazenados como uma string
        await prisma.servicoDetalhe.create({
          data: {
            detalhes: detalhesString,
            servico: { connect: { id: novoServico.id } },
          },
        });
      }
    }
  } catch (error) {
    console.error('Erro ao salvar pedidos recalculados no banco de dados:', error);
    throw error;
  }
};

export const cotacoesGerais = async () => {
  try {
    const cotacoes = await prisma.$queryRaw`
      SELECT d.codigoPedido, s.codigo AS codigoServico, d.cidade AS cidadeDestino, d.uf AS ufDestino, s.valor, s.prazoFinal
      FROM Destino d
      JOIN Servico s ON d.id = s.destinoId
    `;

    const registrosProntos = cotacoes.map(servico => ({
      codigoPedido: servico.codigoPedido,
      cidadeDestino: servico.cidadeDestino,
      ufDestino: servico.ufDestino,
      codigoServico: servico.codigoServico,
      valor: servico.valor,
      prazoFinal: servico.prazoFinal
    }));

    console.log(registrosProntos)
    return registrosProntos
  } catch (error) {
    console.error('Erro: ', error);
  } finally {
    // Fechar a conexão com o Prisma
    await prisma.$disconnect();
  }
}

export const cotacoesVencedoras = async () => {
  try {
    const cotacoes = await prisma.$queryRaw`
      SELECT d.codigoPedido, s.codigo AS codigoServico, d.cidade AS cidadeDestino, d.uf AS ufDestino, s.valor, s.prazoFinal
      FROM Destino d
      JOIN Servico s ON d.id = s.destinoId
      WHERE (s.valor, d.id) IN (
        SELECT MIN(s.valor), s.destinoId
        FROM Servico s
        JOIN Destino d ON s.destinoId = d.id
        GROUP BY d.codigoPedido
      )
    `;

    const registrosProntos = cotacoes.map(servico => ({
      codigoPedido: servico.codigoPedido,
      cidadeDestino: servico.cidadeDestino,
      ufDestino: servico.ufDestino,
      codigoServico: servico.codigoServico,
      valor: servico.valor,
      prazoFinal: servico.prazoFinal
    }));

    console.log(registrosProntos)
    return registrosProntos

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Fechar a conexão com o Prisma
    await prisma.$disconnect();
  }
}

export const cotacoesVencedorasQuantitativos = async () => {
  try {
    const cotacoes = await prisma.$queryRaw`
      SELECT 
          s.codigo AS codigoServico, 
          COUNT(*) AS quantidade,
          AVG(s.prazoFinal) AS mediaPrazoEntrega
      FROM 
          Destino d
          JOIN Servico s ON d.id = s.destinoId
      WHERE 
          (s.valor, d.id) IN (
              SELECT MIN(s.valor), s.destinoId
              FROM Servico s
              JOIN Destino d ON s.destinoId = d.id
              GROUP BY d.codigoPedido
          )
      GROUP BY 
          s.codigo;
    `;

    const registrosProntos = cotacoes.map(servico => ({
      codigoServico: servico.codigoServico,
      quantidade: Number(servico.quantidade),
      mediaPrazoEntrega: servico.mediaPrazoEntrega
    }));

    console.log(registrosProntos)
    return registrosProntos

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Fechar a conexão com o Prisma
    await prisma.$disconnect();
  }
}



const gerarConteudoCsv = (registros) => {
  const headers = [
    'Código do Pedido',
    'Cidade do destino',
    'UF do destino',
    'Código do serviço',
    'Valor',
    'Prazo Final'
  ];

  // Monta o cabeçalho e os registros CSV
  const linhas = [
    headers.join(';'),
    ...registros.map(servico => {
      const valorNumerico = parseFloat(servico.valor); // Converte o valor para número
      const valorFormatado = isNaN(valorNumerico) ? '0,00' : valorNumerico.toFixed(2).replace('.', ','); // Formata o valor

      return [
        servico.codigoPedido,
        servico.cidadeDestino,
        servico.ufDestino,
        servico.codigoServico,
        valorFormatado, // Inclui o valor formatado diretamente
        servico.prazoFinal
      ].join(';');
    })
  ];

  return '\ufeff' + linhas.join('\n'); // Adiciona o BOM e retorna o conteúdo
};


export const gerarCSV = async () => {
  try {
    // Consulta SQL para obter os serviços com o menor valor para cada código de pedido
    const menorValorServicos = await prisma.$queryRaw`
      SELECT d.codigoPedido, s.codigo AS codigoServico, d.cidade AS cidadeDestino, d.uf AS ufDestino, s.valor, s.prazoFinal
      FROM Destino d
      JOIN Servico s ON d.id = s.destinoId
      WHERE (s.valor, d.id) IN (
        SELECT MIN(s.valor), s.destinoId
        FROM Servico s
        JOIN Destino d ON s.destinoId = d.id
        GROUP BY d.codigoPedido
      )
    `;

    // Formatar os dados para o formato esperado pelo CSV Writer
    const registrosCSV = menorValorServicos.map(servico => ({
      codigoPedido: servico.codigoPedido,
      cidadeDestino: servico.cidadeDestino,
      ufDestino: servico.ufDestino,
      codigoServico: servico.codigoServico,
      valor: servico.valor.toFixed(2).replace('.', ','),
      prazoFinal: servico.prazoFinal
    }));

    // Gerar o conteúdo CSV
    const conteudoCsv = gerarConteudoCsv(registrosCSV);

    // Escrever o conteúdo no arquivo CSV
    await writeFile('cotacoes_vencedoras.csv', conteudoCsv, { encoding: 'utf8' });

    console.log('Arquivo CSV gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar o arquivo CSV:', error);
  } finally {
    // Fechar a conexão com o Prisma após a escrita dos dados no arquivo CSV
    await prisma.$disconnect();
  }
};




export const gerarCSVGeral = async () => {
  try {
    // Consulta SQL para obter os serviços com o menor valor para cada código de pedido
    const menorValorServicos = await prisma.$queryRaw`
      SELECT d.codigoPedido, s.codigo AS codigoServico, d.cidade AS cidadeDestino, d.uf AS ufDestino, s.valor, s.prazoFinal
      FROM Destino d
      JOIN Servico s ON d.id = s.destinoId
    `;

    // Formatar os dados para o formato esperado pelo CSV Writer
    const registrosCSV = menorValorServicos.map(servico => ({
      codigoPedido: servico.codigoPedido,
      cidadeDestino: servico.cidadeDestino,
      ufDestino: servico.ufDestino,
      codigoServico: servico.codigoServico,
      valor: servico.valor.toFixed(2).replace('.', ','),
      prazoFinal: servico.prazoFinal
    }));

    // Gerar o conteúdo CSV
    const conteudoCsv = gerarConteudoCsv(registrosCSV);

    // Escrever o conteúdo no arquivo CSV
    await writeFile('cotacoes_gerais.csv', conteudoCsv, { encoding: 'utf8' });


    console.log('Arquivo CSV gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar o arquivo CSV:', error);
  } finally {
    // Fechar a conexão com o Prisma após a escrita dos dados no arquivo CSV
    await prisma.$disconnect();
  }
};


