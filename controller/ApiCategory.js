const Category = require('../models/category');
const { validationResult } = require('express-validator');
module.exports = class ApiCategory {
    // @route   POST api/category
    // @desc    Create category
    // @access  Private
    static async addCategory(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { name } = req.body;
        try {
            let hasCategory = await Category.findOne({ name });
            if (hasCategory) {
                return res.status(400).json({
                    msg: 'category already exists',
                });
            }
            let newCategory = new Category({ name });
            await newCategory.save();
            res.status(200).send(`${newCategory.name} created successfully!`);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   POST api/category/all
    // @desc    get all categories
    // @access  Public
    static async showAll(req, res, next) {
        try {
            let categories = await Category.find();
            res.status(200).json({ categories });
        } catch (error) {
            res.status(404).send('Server error');
        }
    }

    // @route   POST api/category/:id
    // @desc    get single categories
    // @access  Public
    static async showSingle(req, res, next) {
        let { id } = req.params;
        try {
            let category = await Category.findById(id);
            res.status(200).json({ category });
        } catch (error) {
            res.status(404).send(
                'the category with the given ID was not found',
            );
        }
    }

    // @route   PUT api/category/:id
    // @desc    Update single category
    // @access  Private
    static async updateSingle(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            let category = await Category.updateOne(
                { _id: req.params.id },
                req.body,
            );
            res.status(200).send(`updated successfully!`);
        } catch (error) {
            res.status(404).send(
                'the category with the given ID was not found',
            );
        }
    }

    // @route   DELETE api/category/:id
    // @desc    Delete single category
    // @access  Private
    static async deleteSingle(req, res, next) {
        let { id } = req.params;
        try {
            let deletedCategory = await Category.findByIdAndDelete(id);
            res.status(200).send(
                `${deletedCategory.name} deleted successfully!`,
            );
        } catch (error) {
            res.status(404).send(
                'the category with the given ID was not found',
            );
        }
    }
};
