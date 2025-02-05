const { ErrorHandler } = require('../utils/errorHandler.util.js')

const error = (error, req, res, next) => {
    error.message = error.message || error.error.description || "Internal Server Error";
    error.statusCode = error.statusCode || 500;

    console.log(error);
    if (error.name === 'TokenExpiredError') {
        console.log("Token Expired")
        const message = "Token Expired. Please login again";
        error = new ErrorHandler(message, 401);
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message
    })
}

module.exports = {
    error
}