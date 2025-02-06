const prisma = require("../../db/prisma")

const getAll = async () => {
    return prisma.user.findMany({ where: { deletedAt: null } });
}

const getById = async (id) => {
    return prisma.user.findFirst({ where: { id, deletedAt: null } })
}

const getByEmail = async (email) => {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
}

const create = async (payload) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (user && user.deletedAt) {
        return prisma.user.update({
            where: { id: user.id }, data: {
                name: payload.name,
                email: payload.email,
                deletedAt: null
            }
        })
    }

    if (user) {
        return prisma.user.update({
            where: { id: user.id },
            data: {
                name: payload.name,
                email: payload.email
            }
        });
    }

    return prisma.user.create({ data: payload });
}

const updateById = async (id, payload) => {
    return prisma.user.update({ where: { id, deletedAt: null }, data: payload });
}

const softDeleteById = async (id) => {
    return prisma.user.update({
        where: { id, deletedAt: null }, data: {
            deletedAt: new Date()
        }
    })
}

const hardDeleteById = async (id) => {
    return prisma.user.delete({ where: { id, deletedAt: null } });
}

module.exports = {
    getAll,
    getByEmail,
    getById,
    create,
    updateById,
    softDeleteById,
    hardDeleteById
}