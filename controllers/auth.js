const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const {BadRequestError} = require('../errors');

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
    const user = User.findOne({email: req.body.email, password: req.body.password});

    if (!user) {
        throw new BadRequestError('No user found');
    }

    const token = jwt.sign({userId: user._id, name: user.name}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};
