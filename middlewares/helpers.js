const User = require('../models/user');
const Meal = require('../models/meal');
const Order = require('../models/order');

module.exports = {
  async findUserById(req, res, id) {
    const user = await User.findById(id).select([
      '-carts',
      '-payments',
      '-password',
    ]);
    if (!user)
      return res.status(404).json({
        success: false,
        message: 'No User Found',
      });

    return user;
  },
  async findFullUserById(req, res, id) {
    const user = await User.findById(id).select('-password');
    if (!user)
      return res.status(404).json({
        success: false,
        message: 'No User Found',
      });

    return user;
  },
  async findMealById(req, res, id) {
    const meal = await Meal.findById(id);
    if (!meal)
      return res.status(404).json({
        success: false,
        message: 'No Meal Found',
      });

    return meal;
  },
  async findOrderById(req, res, id) {
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({
        success: false,
        message: 'No Order Found',
      });

    return order;
  },
};
