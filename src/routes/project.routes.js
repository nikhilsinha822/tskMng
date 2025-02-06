const express = require('express');
const {
    getAllProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controller/project/project.controller');
const router = express.Router();

router.route('/')
    .get(getAllProject)
    .post(createProject)

router.route('/:id')
    .put(updateProject)
    .delete(deleteProject)

module.exports = router