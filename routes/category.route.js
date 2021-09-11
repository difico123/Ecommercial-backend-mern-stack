const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/admin.auth');
const ApiCategory = require('../controller/ApiCategory');
const { check } = require('express-validator');

router.post(
    '/',
    [check('name', 'Name is required').trim().not().isEmpty()],
    auth,
    authAdmin,
    ApiCategory.addCategory,
);
module.exports = router;
