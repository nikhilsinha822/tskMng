const jwt = require('jsonwebtoken')
const UserServices = require('../services/user/user.services');
const { ErrorHandler } = require('../utils/errorHandler.util');

const verifyJWT = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token){
        return next(new ErrorHandler('Please login again', 401))
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await UserServices.getById(decoded.id)
    if(!user){
        return next(new ErrorHandler('Please login again', 401))
    }
    req.user = user;
    next();
}

module.exports = verifyJWT