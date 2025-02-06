const jwt = require('jsonwebtoken');
const { catchAsyncError } = require('../../middleware/catchAsyncError');
const UserServices = require('../../services/user/user.services')
const bcrypt = require('bcrypt')

const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Email or Password'
        })
    }

    const user = await UserServices.getByEmail(email);

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Email or Password'
        })
    }

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
        message: 'User is logged in'
    })
})

module.exports = {
    login
}