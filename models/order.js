const { Schema, model } = require('mongoose');

const order = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  menu: {
    type: Schema.Types.ObjectId,
    ref: 'menu',
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  orderedDate: {
    type: Date,
  },
  deliveredDate: {
    type: Date,
  },
  status: {
    type: String,
    default: 'processing',
    enum: {
      values: ['processing', 'delivered'],
      message: '{VALUE} is not supported',
    },
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('order', order);
