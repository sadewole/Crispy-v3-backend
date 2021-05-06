const express = require('express');
const database = require('./database');

database();
const app = express();

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Running on PORT:::', PORT));
