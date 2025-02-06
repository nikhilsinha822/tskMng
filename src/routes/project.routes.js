const express = require('express');
const {
    getAllProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controller/project/project.controller');
const { getAllProjectTask, createProjectTask } = require('../controller/task/task.controller');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.use(verifyJWT);

router.route('/')
    .get(getAllProject)
    .post(createProject)

router.route('/:id')
    .put(updateProject)
    .delete(deleteProject)

router.route('/:projectId/tasks')
    .get(getAllProjectTask)
    .post(createProjectTask)

module.exports = router