const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);

})