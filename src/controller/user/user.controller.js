const { ErrorHandler } = require("../../utils/errorHandler.util");
const { catchAsyncError } = require("../../middleware/catchAsyncError");
const UserServices = require('../../services/user/user.services')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const getUsers = catchAsyncError(async (req, res, next) => {
    const user = await UserServices.getAll();

    return res.status(200).json({
        success: true,
        data: user
    })
})

const createUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Missing required fields", 400))
    }

    const duplicate = email && (await UserServices.getByEmail(email));
    if (duplicate) {
        return next(new ErrorHandler("Email already in use", 400))
    }

    const hshPass = await bcrypt.hash(password, 10);
    const payload = { email, name, password: hshPass };
    const user = await UserServices.create(payload);

    const accessToken = jwt.sign({
        id: user.id,
        email: email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    })

    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        data: user
    })
})


const updateUser = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    const { id } = req.params;
    if (!name && !email) {
        return next(new ErrorHandler("Missing required fields", 400))
    }

    const isValid = await UserServices.getById(id);
    if (!isValid) {
        return next(new ErrorHandler("Invalid ID provided", 400))
    }

    const duplicate = await UserServices.getByEmail(email);
    if (duplicate) {
        return next(new ErrorHandler("Email already in use", 400))
    }

    let payload = {};
    if (email) payload = { ...payload, email };
    if (name) payload = { ...payload, name };
    const user = await UserServices.updateById(id, payload);

    return res.status(200).json({
        success: true,
        data: user
    })
})

const deleteUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const isValid = await UserServices.getById(id);
    if (!isValid) {
        return next(new ErrorHandler("Invalid ID provided", 400))
    }

    await UserServices.softDeleteById(id);

    res.status(200).json({
        success: true,
        message: "Successfully deleted user"
    })
})

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
