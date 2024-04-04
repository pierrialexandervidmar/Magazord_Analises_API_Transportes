import { prisma } from '../services/prisma.js';

export const getUser = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};
