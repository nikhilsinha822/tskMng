const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controller/user/user.controller');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(createUser)

router.use(verifyJWT)

router.route('/:id')
    .put(updateUser)
    .delete(deleteUser)

module.exports = router