import { prisma } from "../services/prisma.js";

// CRIAR UMA VENDA
export const createSale = async (data) => {
    const sale = await prisma.sales.create({
        data: data
    });
    return sale;
}

// LISTAR VENDAS
export const getSales = async () => {
    const sales = await prisma.sales.findMany({});
    return sales;
}

// LISTAR UMA VENDA
export const findSale = async (id) => {
    const sale = await prisma.sales.findUnique({
        where: {
            id: id
        }
    });
    return sale;
}

// ATUALIZAR UMA VENDA
export const updateSale = async (id, data) => {
    const sale = await prisma.sales.update({
        where: {
            id: id
        },
        data: data
    });
    return sale;
}

// DELETAR UMA VENDA
export const removeSale = async (id) => {
    await prisma.sales.delete({
        where: {
            id: id
        }
    });
}
