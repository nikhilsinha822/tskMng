const prisma = require("../../db/prisma")

const getAll = async () => {
    return prisma.user.findMany();
}

const getById = async (id) => {
    return prisma.user.findFirst({ where: { id } })
}

const getByEmail = async (email) => {
    return prisma.user.findFirst({ where: { email } });
}

const create = async (payload) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (user && user.deletedAt) {
        return prisma.user.update({
            where: { id: user.id }, data: {
                name: payload.name,
                email: payload.email
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
    return prisma.user.update({ where: { id }, data: payload });
}

const deleteById = async (id) => {
    return prisma.user.delete({ where: { id } });
}

module.exports = {
    getAll,
    getByEmail,
    getById,
    create,
    updateById,
    deleteById,
}