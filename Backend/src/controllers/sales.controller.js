import { saleValidation, updateValidation } from '../validations/sales.validation.js';
import { createSale, findSale, getSales, removeSale, updateSale } from '../repositories/sales.repository.js';

// CHAMA O MÉTODO QUE CRIA UMA VENDA
export const create = async (req, res) => {
    try {
        const data = await saleValidation.parse(req.body);
        const sale = await createSale(data);
        res.status(200).send(sale);
    } catch (error) {
        res.status(400).send(error);
    }
}

// CHAMA O MÉTODO QUE RETORNA TODAS AS VENDAS
export const get = async (req, res) => {
    try {
        const sales = await getSales();
        res.status(200).send(sales);
    } catch (error) {
        res.status(400).send(error);
    }
}

// CHAMA O MÉTODO QUE RETORNA UMA ÚNICA VENDA
export const getId = async (req, res) => {
    try {
        const sale = await findSale(Number(req.params.id));
        res.status(200).send(sale);
    } catch (error) {
        res.status(400).send(error);
    }
}

// CHAMA O MÉTODO QUE ATUALIZA UMA VENDA
export const update = async (req, res) => {
    try {
        const data = await updateValidation.parse(req.body);
        const sale = await updateSale(Number(req.params.id), data);
        res.status(200).send(sale);
    } catch (error) {
        res.status(400).send(error);
    }
}

// CHAMA O MÉTODO QUE REMOVE UMA VENDA
export const remove = async (req, res) => {
    try {
        const sale = await removeSale(Number(req.params.id));
        res.status(200).send(sale);
    } catch (error) {
        res.status(400).send(error);
    }
}
