const express = require('express')
const router = express.Router();

router.use('/users', require('./user.routes'))
router.use('/projects', require('./project.routes'))
router.use('/tasks', require('./task.routes'))
router.use('/auth', require('./auth.routes'))

module.exports = router