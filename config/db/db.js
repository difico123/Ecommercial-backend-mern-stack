const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.ATLAS_URI, (err) => {
        if (err) throw err;
        console.log('connected to MongoDB');
    });
}

module.exports = {
    connect,
};
