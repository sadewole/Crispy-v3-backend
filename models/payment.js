const { Schema, model } = require('mongoose');

const payment = new Schema({
  paymentDate: {
    type: Date,
  },
  deliveredDate: {
    type: Date,
  },
  status: {
    type: String,
    default: 'new',
    enum: {
      values: ['new', 'processing', 'delivered'],
      message: '{VALUE} is not supported',
    },
  },
  orders: {
    type: Array,
    required: true,
  },
});

module.exports = model('payment', payment);
