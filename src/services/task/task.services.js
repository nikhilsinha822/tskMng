const prisma = require("../../db/prisma")

const getAllByProject = async (projectId) => {
    return prisma.task.findMany({ where: { projectId } })
}

const getAllByFilter = async (filter) => {
    return prisma.task.findMany({ where: filter })
}

const getById = async (id) => {
    return prisma.task.findFirst({ where: { id } })
}

const create = async (payload) => {
    return prisma.task.create({ data: payload });
}

const updateById = async (id, payload) => {
    return prisma.task.update({ where: { id }, data: payload });
}

const deleteById = async (id) => {
    return prisma.task.delete({ where: { id } });
}

module.exports = {
    getAllByProject,
    getById,
    getAllByFilter,
    create,
    updateById,
    deleteById,
}
