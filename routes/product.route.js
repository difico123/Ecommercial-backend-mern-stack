const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/admin.auth');
const productById = require('../middleware/productById');
const ApiProduct = require('../controller/ApiProduct');

// @route GET api/product/list
// @desc Get list product
// @option (order = asc or desc, sortBy any product property like name, limit, number of returned product)
// @access Public
router.get('/list', ApiProduct.list);

// @route GET api/product/photo/:productId
// @desc Get a product
// @access Public
router.get('/photo/:productId', productById, ApiProduct.getPhoto);

// @route POST api/product/
// @desc Create a product
// @access Private
router.post('/', auth, authAdmin, ApiProduct.addProduct);

// @route   GET api/product/categories
// @desc    Get a list categories of products
// @access  Public
router.get('/categories', ApiProduct.listCategory);

// @route   Post api/product/filter
// @desc    filter a Product by price and category
// @access  Public
router.post('/filter', ApiProduct.filter);

// @route   Get api/product/search
// @desc    Get a list products by search quey
// @access  Public
router.get('/search', ApiProduct.search);

// @route   Get api/product/related/:productId
// @desc    Get a list related to  product
// @access  Public
router.get('/related/:productId', productById, ApiProduct.relatedList);

// @route GET api/product/:productId
// @desc Get a product
// @access Public
router.get('/:productId', productById, ApiProduct.getSingle);

// @route GET api/product/
// @desc Get all product
// @access Public
router.get('/', ApiProduct.getAll);

module.exports = router;
