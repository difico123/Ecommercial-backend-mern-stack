const express = require('express');
const morgan = require('morgan'); // log http request
const cors = require('cors');
const db = require('./config/db/db.js');

require('dotenv').config({
    path: './config/environment/index.env',
});

//MongoDB
db.connect();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api/user/', require('./routes/auth.route'));

app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not found',
    });
});

app.listen(PORT, () => {
    console.log(`app listening on port http://localhost:${PORT}`);
});
