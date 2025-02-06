const express = require('express');
const {
    updateTask,
    deleteTask
} = require('../controller/task/task.controller');
const router = express.Router();

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask)

module.exports = router