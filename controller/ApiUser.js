const User = require('../models/User');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar'); // get user image by email
const jwt = require('jsonwebtoken'); // to generate token
const bcrypt = require('bcryptjs'); // encrypt password
const joi = require('joi');

module.exports = class ApiUser {
    // @route   POST api/user/register
    // @desc    Register user
    // @access  Public
    static async resgister(req, res) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.errors.map((item) => item.msg),
            });
        }
        // get name and email and password from request
        const { name, email, password } = req.body;

        try {
            // Check if user already exist
            let hasUser = await User.findOne({
                email,
            });

            // If user exist
            if (hasUser) {
                return res.status(400).json({
                    msg: 'User already exists',
                });
            }

            // If not exists
            // get image from gravatar
            const avatar = gravatar.url(email, {
                s: '200', // Size
                r: 'pg', // Rate,
                d: 'mm',
            });

            // create user object
            let user = new User({
                name,
                email,
                avatar,
                password,
            });

            // encrypt password
            const salt = await bcrypt.genSalt(10); // generate salt contains 10
            // save password
            user.password = await bcrypt.hash(password, salt); // use user password and salt to hash password
            //save user in database
            await user.save();

            // payload to generate token
            // payload contains user's id
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 360000, // for development for production it will 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                    });
                },
            );
        } catch (error) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }

    // @route   POST api/user/login
    // @desc    login user
    // @access  Public
    static async login(req, res) {
        //if error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        // else everything is ok
        const { email, password } = req.body;

        try {
            //find user
            let user = await User.findOne({ email });
            //if user not found in database
            if (!user) {
                return res.status(404).json({
                    error: 'user not found',
                });
            }

            //else Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(404).json({
                    error: 'password is not correct',
                });
            }

            //payload for jwt
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 360000, // for development for production it will 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                    });
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   POST api/user
    // @desc    User information
    // @access  Private
    static async getInfor(req, res) {
        try {
            //get user information by id
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
