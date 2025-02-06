const prisma = require("../../db/prisma")

const getAll = async () => {
    return prisma.project.findMany();
}

const getById = async (id) => {
    return prisma.project.findFirst({ where: { id } })
}

const create = async (payload) => {
    return prisma.project.create({ data: payload });
}

const updateById = async (id, payload) => {
    return prisma.project.update({ where: { id }, data: payload });
}

const deleteById = async (id) => {
    return prisma.project.delete({ where: { id } });
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
