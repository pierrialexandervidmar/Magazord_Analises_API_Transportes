const { prisma } = require('../services/prisma');

exports.getUser = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
    return user;
};

