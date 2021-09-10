const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: {
        // Role of user it will be (nomal or admin)
        type: Number,
        default: 0,
    },
    history: {
        //Order history
        type: Array,
        default: [],
    },
});
module.exports = User = mongoose.model('User', UserSchema);
