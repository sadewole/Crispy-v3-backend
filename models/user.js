const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'CLIENT',
    enum: {
      values: ['CLIENT', 'ADMIN'],
      message: '{VALUE} is not supported',
    },
  },
  profile: {
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  carts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'order',
    },
  ],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'payment',
    },
  ],
});

module.exports = User = mongoose.model('user', userSchema);
