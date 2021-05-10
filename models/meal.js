const { Schema, model } = require('mongoose');

const meal = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('meal', meal);
