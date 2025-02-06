const prisma = require("../../db/prisma")

const getAll = async () => {
    return prisma.project.findMany({ where: { deletedAt: null } });
}

const getById = async (id) => {
    return prisma.project.findUnique({ where: { id } })
}

const create = async (payload) => {
    return prisma.project.create({ data: payload });
}

const updateById = async (id, payload) => {
    return prisma.project.update({ where: { id }, data: payload });
}

const softDeleteById = async (id) => {
    return prisma.project.update({
        where: { id }, data: {
            deletedAt: new Date()
        }
    })
}

const hardDeleteById = async (id) => {
    return prisma.project.delete({ where: { id } });
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    softDeleteById,
    hardDeleteById
}
