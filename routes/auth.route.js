const express = require('express');
const router = express.Router();
// Check validation for requests
const { check } = require('express-validator');
// Models
let ApiUser = require('../controller/ApiUser');
const auth = require('../middleware/auth');

// @route   POST api/user
// @desc    User information
// @access  Private
router.get('/', auth, ApiUser.getInfor);

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
        // validation
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters',
        ).isLength({
            min: 6,
        })
    ,
    ApiUser.resgister,
);

// @route   POST api/user/login
// @desc    login user
// @access  Public
router.post(
    '/login',
    [
        // validation
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    ApiUser.login,
);
module.exports = router;
