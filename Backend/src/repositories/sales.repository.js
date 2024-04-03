const { prisma } = require("../services/prisma");

// CRIAR UMA VENDA
exports.createSale = async (data) => {
    const sale = await prisma.sales.create({
        data: data
    });
    return sale;
}

// LISTAR VENDAS
exports.getSales = async () => {
    const sales = await prisma.sales.findMany({});
    return sales;
}

// LISTAR UMA VENDA
exports.findSale = async (id) => {
    const sale = await prisma.sales.findUnique({
        where: {
            id: id
        }
    });
    return sale;
}

// ATUALIZAR UMA VENDA
exports.updateSale = async (id, data) => {
    const sale = await prisma.sales.update({
        where: {
            id: id
        },
        data: data
    });
    return sale;
}

// DELETAR UMA VENDA
exports.removeSale = async (id) => {
    await prisma.sales.delete({
        where: {
            id: id
        }
    });
    return;
}