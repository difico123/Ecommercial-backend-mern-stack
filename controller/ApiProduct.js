const Product = require('../models/Product');
const formidable = require('formidable');
const fs = require('fs');

module.exports = class ApiProduct {
    // @route POST api/product/
    // @desc Create a product
    // @access Private
    static addProduct(req, res, next) {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded!',
                });
            }

            if (!files.photo) {
                return res.status(400).json({
                    error: 'Image is required!',
                });
            }

            if (
                files.photo.type != 'image/jpeg' &&
                files.photo.type != 'image/jpg' &&
                files.photo.type != 'image/png'
            ) {
                return res.status(400).json({
                    error: 'Image type is not allowed!',
                });
            }
            // Check for all fields
            const { name, description, quantity, price, category, shipping } =
                fields;

            if (
                !name ||
                !description ||
                !quantity ||
                !price ||
                !category ||
                !shipping
            ) {
                return res.status(400).json({
                    error: 'All fields are required',
                });
            }

            let product = new Product(fields);
            //1MB = 1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image size should be less than 1 MB',
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
            //console.log(files);
            try {
                await product.save();
                res.json('Product created successfully!');
            } catch (error) {
                console.log(error);
                return res.status(500).send('Server error');
            }
        });
    }

    // @route GET api/product/:productId
    // @desc Get a product
    // @access Public
    static async getSingle(req, res, next) {
        req.product.photo = undefined;
        res.status(200).json(req.product);
    }

    // @route GET api/product/:productId
    // @desc Get a product
    // @access Public
    static async getPhoto(req, res, next) {
        if (!req.product.photo.data) {
            return res.status(404).json({ error: 'failed to load image' });
        }
        res.set('Content-Type', req.product.photo.contentType);
        res.status(200).send(req.product.photo.data);
    }

    // @route GET api/product/
    // @desc Get all product
    // @access Public
    static async getAll(req, res, next) {
        try {
            let product = await Product.find()
                .select('-photo')
                .populate('category','_id name');
            res.status(200).json({ product });
        } catch (error) {
            res.status(404).send('Server error');
        }
    }

    // @route GET api/product/list
    // @desc Get list product
    // @option (order = asc or desc, sortBy any product property like name, limit, number of returned product)
    // @access Public
    static async list(req, res, next) {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;

        try {
            let products = await Product.find({})
                .select('-photo')
                .populate('category')
                .sort([[sortBy, order]])
                .limit(limit)
                .exec(); // use exec() that gives better stack trace compared to await without exec()
            res.status(200).json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send('invalid queries');
        }
    }

    // @route   Get api/product/categories
    // @desc    Get a list categories of products
    // @access  Public
    static async listCategory(req, res, next) {
        try {
            let categories = await Product.distinc('category');
            if (!categories) {
                return res.status(400).json({ error: 'Categories not found' });
            }

            res.status(200).json(categories);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    // @route   Post api/product/filter
    // @desc    filter a Product by price and category
    // @access  Public
    static async filter(req, res, next) {
        let order = req.body.order ? req.body.order : 'desc';
        let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};

        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === 'price') {
                    // gte -  greater than price [0-10]
                    // lte - less than
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1],
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }

        try {
            let products = await Product.find(findArgs)
                .select('-photo')
                .populate('category')
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit);
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send('Products not found');
        }
    }
    // @route   Get api/product/search
    // @desc    Get a list products by search quey
    // @access  Public
    static async search(req, res) {
        // create query object to hold search value and category value
        const query = {};
        // assign search value to query.name
        if (req.query.search) {
            query.name = {
                $regex: req.query.search,
                $options: 'i',
            };
            // assigne category value to query.category
            if (req.query.category && req.query.category != 'All') {
                query.category = req.query.category;
            }
        }
        try {
            let products = await Product.find(query).select('-photo');
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error to get products');
        }
    }

    // @route   Get api/product/related:productId
    // @desc    Get a list related to  product
    // @access  Public
    static async relatedList(req, res) {
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
        let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
        let order = req.query.order ? req.query.order : 'desc';

        try {
            let products = await Product.find({
                _id: {
                    $ne: req.product,
                },
                category: req.product.category,
            })
                .select('-photo')
                .limit(limit)
                .sort([[sortBy, order]])
                .populate('category', '_id name');

            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).send('Invalid querys');
        }
    }
};
