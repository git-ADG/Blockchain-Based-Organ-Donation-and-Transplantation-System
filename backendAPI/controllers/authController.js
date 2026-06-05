const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const AppError = require('../utils/AppError');

const signToken = (id, role, username, organization, fabricIdentity) => {
    return jwt.sign({ id, role, username, organization, fabricIdentity }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            organization: req.body.organization || 'HospitalA',
            fabricIdentity: req.body.username 
        });

        const token = signToken(newUser._id, newUser.role, newUser.username, newUser.organization, newUser.fabricIdentity);

        res.status(201).json({
            status: 'success',
            token,
            data: { user: { username: newUser.username, role: newUser.role } }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return next(new AppError('Please provide username and password', 400));
        }

        const user = await User.findOne({ username }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect username or password', 401));
        }

        const token = signToken(user._id, user.role, user.username, user.organization, user.fabricIdentity);

        res.status(200).json({
            status: 'success',
            token,
            user: { role: user.role }
        });
    } catch (err) {
        next(err);
    }
};