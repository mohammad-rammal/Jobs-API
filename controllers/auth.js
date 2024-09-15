const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const {BadRequestError, UnauthenticatedError} = require('../errors');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError('Please enter the missing fields');
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // const tempUser = {email, name, password: hashedPassword};

    const user = await User.create({
        ...req.body,
    });

    const token = user.createJWT();

    user.password = undefined;

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        user: {name: user.name},
        token,
    });
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please enter the missing fields');
    }

    const user = await User.findOne({email}).select('+password');
    if (!user) {
        throw new UnauthenticatedError('The email or password not found!');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('The email or password not found!');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        status: 'success',
        user: {name: user.name, email: user.email},
        token,
    });
};
