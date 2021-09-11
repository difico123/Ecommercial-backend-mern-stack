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
            res.status(200).json({
                newCategory,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
