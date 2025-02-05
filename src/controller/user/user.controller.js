const { ErrorHandler } = require("../../utils/errorHandler.util");
const { catchAsyncError } = require("../../middleware/catchAsyncError");
const UserServices = require('../../services/user/user.services')

const getUsers = catchAsyncError(async (req, res, next) => {
    const user = await UserServices.getAll();

    return res.status(200).json({
        success: true,
        data: user
    })
})

const createUser = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return next(new ErrorHandler("Missing required fields", 400))
    }

    const duplicate = email && (await UserServices.getByEmail(email));
    if (duplicate) {
        return next(new ErrorHandler("Email already in use", 400))
    }

    const payload = { email, name };
    const user = await UserServices.create(payload);

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
