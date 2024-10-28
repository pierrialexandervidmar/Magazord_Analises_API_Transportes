import axios from 'axios';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

export const recriarBancoDados = () => {
  try {
    // Excluir o banco de dados SQLite existente
    fs.unlinkSync(process.env.DB);
    console.log('Banco de dados SQLite excluído com sucesso.');

    // Executar as migrations do Prisma para criar o novo banco de dados
    exec('npx prisma migrate dev', async (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao aplicar as migrations do Prisma:', error);
        res.status(500).send('Erro ao aplicar as migrations do Prisma: ' + error.message);
        return;
      }

      console.log('Migrations do Prisma aplicadas com sucesso:', stdout);
      console.log('Novo banco de dados SQLite criado com sucesso.');

    });
  } catch (error) {
    console.error('Erro ao excluir o banco de dados SQLite:', error);
  }
}

export const formatarValor = (valor) => {
  // Verifica se o valor é uma string e converte
  if (typeof valor === 'string') {
    // Substitui ',' por '.' para suportar decimais no formato brasileiro e converte para float
    valor = valor.replace(',', '.');
    valor = parseFloat(valor);
  }

  // Verifica se a conversão foi bem-sucedida, caso contrário, retorna NaN
  if (isNaN(valor)) {
    console.warn("Valor inválido. Não foi possível converter para número.");
    return NaN;
  }

  // Retorna o valor formatado como número com ponto flutuante
  return valor;
}

