const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { error } = require('./src/middleware/error');
const router = require('./src/routes');
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(router);
app.use(error);

app.listen(PORT, () => {
    console.log('Server is running at PORT', PORT);
})