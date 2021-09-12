const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/admin.auth');
const ApiCategory = require('../controller/ApiCategory');
const { check } = require('express-validator');

// @route   POST api/category
// @desc    Create category
// @access  Private
router.post(
    '/',
    [check('name', 'Name is required').trim().not().isEmpty()],
    auth,
    authAdmin,
    ApiCategory.addCategory,
);

// @route   GET api/category/all
// @desc    Get all categories
// @access  Public
router.get('/all', ApiCategory.showAll);

// @route   POST api/category/:id
// @desc    Get single categories
// @access  Public
router.get('/:id', ApiCategory.showSingle);

// @route   PUT api/category/:id
// @desc    Update single category
// @access  Private
router.put(
    '/:id',
    [check('name', 'Name is required').trim().not().isEmpty()],
    auth,
    authAdmin,
    ApiCategory.updateSingle,
);

// @route   DELETE api/category/:id
// @desc    Delete single category
// @access  Private
router.delete('/:id', auth, authAdmin, ApiCategory.deleteSingle);

module.exports = router;
