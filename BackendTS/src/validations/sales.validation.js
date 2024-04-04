import { z } from 'zod';

export const saleValidation = z.object({
    coin: z.string(),
    date_purchase: z.string(),
    value_purchase: z.number(),
    unity_purchase: z.number(),
    total_money_purchase: z.number(),
});

export const updateValidation = z.object({
    value_sale: z.number(),
    date_sale: z.string(),
    unity_sale: z.number(),
    total_money_sale: z.number(),
    profit: z.number(),
});
