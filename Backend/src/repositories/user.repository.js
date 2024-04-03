const { prisma } = require("../services/prisma")

exports.createUser = async (data) => {
    const user = await prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    });
    return user
}

exports.getUser = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    })
    return users;
};

exports.getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    })
    return user;
}

exports.updateUser = async (id, data) => {
    const user = await prisma.user.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    })
    return user;
}

exports.removeUser = async (id) => {
    const user = await prisma.user.delete({
        where: {
            id
        }
    })
    return;
}