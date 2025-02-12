const express = require('express');
const {
    updateTask,
    deleteTask,
    getAllTaskByFilter
} = require('../controller/task/task.controller');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.use(verifyJWT)

router.route('/')
    .get(getAllTaskByFilter)

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask)


module.exports = router