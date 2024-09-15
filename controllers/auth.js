const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {BadRequestError} = require('../errors');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError('Please enter the missing fields');
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = {email, name, password: hashedPassword};

    const user = await User.create({
        ...tempUser,
    });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
            user,
        },
    });
};

exports.login = async (req, res) => {
    res.send('login');
};
