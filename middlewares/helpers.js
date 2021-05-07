const User = require('../models/user');
const Meal = require('../models/meal');

module.exports = {
  async findUserById(req, res, id) {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: 'No User Found',
      });

    return user;
  },
  async findMenuById(req, res, id) {
    const meal = await Meal.findById(id);
    if (!meal)
      return res.status(404).json({
        success: false,
        message: 'No Meal Found',
      });

    return meal;
  },
};
