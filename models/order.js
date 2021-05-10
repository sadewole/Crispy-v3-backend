const { Schema, model } = require('mongoose');

const order = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  meal: {
    type: Schema.Types.ObjectId,
    ref: 'meal',
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment: {
    type: Boolean,
    required: true,
  },
});

module.exports = model('order', order);
