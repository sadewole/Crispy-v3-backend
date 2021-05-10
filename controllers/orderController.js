const Order = require('../models/order');
const User = require('../models/user');
const Helper = require('../middlewares/helpers');

module.exports = {
  getAllOrder: async (req, res) => {
    try {
      const orders = await Order.find({});
      if (orders.length < 1) {
        return res.status(200).json({
          message: 'Order history is empty',
          success: true,
        });
      }

      const data = [];
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const food = await Helper.findMealById(req, res, order.mealId);
        const user = await Helper.findUserById(req, res, order.userId);
        data.push(
          Object.assign(order, {
            food,
            user,
          })
        );
      }

      return res.status(200).json({
        success: true,
        message: 'List of orders',
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err,
        success: false,
      });
    }
  },

  addNewOrder: async (req, res) => {
    const { mealId, quantity } = req.body;
    try {
      const userId = req.user.id;

      const findMenu = await Helper.findMealById(req, res, mealId);
      const buyer = await Helper.findUserById(req, res, userId);

      const data = await Order({
        mealId: findMenu.id,
        userId,
        quantity,
        amount: quantity * Number(findMenu.price),
        payment: false,
      });

      // add the newly created order to the actual user cart
      buyer.carts.push(car);
      await buyer.save();

      return res.status(200).json({
        success: true,
        message: 'Order created successfully',
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err,
        success: false,
      });
    }
  },

  getSingleOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const data = [];
      const order = await Helper.findOrderById(req, res, id);
      const food = await Helper.findMealById(req, res, order.mealId);
      const user = await Helper.findUserById(req, res, order.userId);

      data.push(
        Object.assign(order, {
          food,
          user,
        })
      );

      return res.status(200).json({
        success: true,
        message: 'Request successful',
        data,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
        success: false,
      });
    }
  },

  //   updateQuantity: async (req, res) => {
  //     const { id } = req.params;
  //     let quantity = req.body.quantity;
  //     try {
  //       if (!quantity) {
  //         return res.status(400).json({
  //           message: 'Field must not be empty',
  //           success: false
  //         });
  //       }
  //       quantity = Number(quantity)
  //       const findId = await Helper.findOrderById(req, res, id);
  //       // find meal to obtain price
  //       const findMenu = await Helper.findMealById(findId.mealId);
  //        const user = await Helper.findUserById(req, res, order.userId);

  //       const data = await Order.findByIdAndUpdate(id,
  //         {
  //           quantity,
  //           amount: quantity * findMenu.price,
  //         }
  //       );

  //       return res.status(200).json({
  //         success: true,
  //         message: 'Order updated successfully',
  //         data,
  //       });
  //     } catch (err) {
  //       res.status(400).json({
  //         message: err,
  //         success: false
  //       });
  //     }
  //   },
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
      await Helper.findOrderById(req, res, id);

      await Order.findByIdAndDelete(id);
      const user = await Helper.findUserById(req, res, userId);

      // remove the newly deleted order from the user cart
      user.carts.filter((cart) => cart._id !== id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Order Deleted successfully',
      });
    } catch (err) {
      res.status(400).json({
        message: err,
        success: false,
      });
    }
  },
};
