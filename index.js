const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const database = require('./database');

// Routes
const userRoutes = require('./routes/userRoute');
const mealRoutes = require('./routes/mealRoute');
const orderRoutes = require('./routes/orderRoute');

database();
const app = express();
// Middlewares
app.use(logger());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.json({ message: 'Yo!, welcome to crispy munch server' })
);
app.use('/api/v1', userRoutes, mealRoutes, orderRoutes);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-access-token'
  );
  next();
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Running on PORT:::', PORT));
