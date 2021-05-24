const Order = require('../models/order');
const Payment = require('../models/payment');
const Helper = require('../middlewares/helpers');

module.exports = {
  getAllOrder: async (req, res) => {
    try {
      const orders = await Order.find({});
      if (orders.length < 1) {
        return res.status(200).json({
          message: 'Order history is empty',
          success: true,
          data: [],
        });
      }

      let data = [];
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const food = await Helper.findMealById(req, res, order.mealId);
        const user = await Helper.findUserById(req, res, order.userId);
        data = [...data, { order, food, user }];
      }

      return res.status(200).json({
        success: true,
        message: 'List of orders',
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },

  addNewOrder: async (req, res) => {
    let { mealId, quantity } = req.body;
    try {
      const userId = req.decoded.id;
      quantity = Number(quantity);
      const findMenu = await Helper.findMealById(req, res, mealId);
      const buyer = await Helper.findFullUserById(req, res, userId);
      const data = await Order({
        mealId: findMenu._id,
        userId,
        quantity,
        amount: quantity * findMenu.price,
        payment: false,
      });

      await data.save();

      // add the newly created order to the actual user cart
      buyer.carts.push(data);
      await buyer.save();

      return res.status(200).json({
        success: true,
        message: 'Order created successfully',
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },

  getSingleOrder: async (req, res) => {
    const { id } = req.params;
    try {
      let data = [];
      const order = await Helper.findOrderById(req, res, id);
      const food = await Helper.findMealById(req, res, order.mealId);
      const user = await Helper.findUserById(req, res, order.userId);

      data = [...data, food, user];

      return res.status(200).json({
        success: true,
        message: 'Request successful',
        data,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },

  updateQuantity: async (req, res) => {
    const { id } = req.params;
    let quantity = req.body.quantity;
    try {
      if (!quantity) {
        return res.status(400).json({
          message: 'Field must not be empty',
          success: false,
        });
      }
      quantity = Number(quantity);
      const findId = await Helper.findOrderById(req, res, id);
      // find meal to obtain price
      const findMenu = await Helper.findMealById(req, res, findId.mealId);
      const user = await Helper.findFullUserById(req, res, req.decoded.id);

      const data = await Order.findByIdAndUpdate(
        id,
        {
          quantity,
          amount: quantity * findMenu.price,
        },
        { new: true }
      );
      // find order in user cart and make update
      const findIndex = user.carts.findIndex((cart) => cart.id === id);
      user.carts.splice(findIndex, 1, data);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: {
          cart: data,
          food: findMenu,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    const userId = req.decoded.id;
    try {
      await Helper.findOrderById(req, res, id);

      const user = await Helper.findFullUserById(req, res, userId);

      // remove the newly deleted order from the user cart
      if (user.carts.filter((cart) => cart.toString() === id).length > 0) {
        const removeIndex = user.carts.map((cart) =>
          cart.toString().indexOf(id)
        );
        await user.carts.splice(removeIndex, 1);

        await user.save();
      }
      // delete order
      await Order.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Order Deleted successfully',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },
  userOrderPayment: async (req, res) => {
    const userId = req.decoded.id;
    try {
      let orders = [];
      const user = await Helper.findFullUserById(req, res, userId);
      let carts = user.carts;
      // update the newly paid user order
      for (let i = 0; i < carts.length; i++) {
        const cartId = carts[i];
        const order = await Order.findByIdAndUpdate(
          cartId,
          {
            payment: true,
          },
          { new: true }
        );

        orders.push(order);
      }
      // save order payments
      const payment = await Payment({
        orders,
      });
      await payment.save();

      // // empty the user cart and add payment to user order history
      user.carts = [];
      user.payments.push(payment);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Payment successful',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },
  async updateOrderDelivery(req, res) {
    const { id } = req.params;
    try {
      const findPayment = await Payment.findById(id);
      if (!findPayment) {
        return res.status(404).json({
          success: false,
          message: 'Not found',
        });
      }

      const newPayment = await Payment.findByIdAndUpdate(
        id,
        {
          deliveredDate: req.body.deliveredDate,
          status: req.body.status,
        },
        { new: true }
      );
      await newPayment.save();

      return res.status(200).json({
        success: true,
        message: 'Payment updated successful',
        data: newPayment,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
    }
  },
  async fetchSingleOrderDelivery(req, res) {
    const { id } = req.params;
    try {
      const data = await Payment.findById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Fetched successfully',
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchAllPaymentHistories(req, res) {
    try {
      const data = await Payment.find({});
      if (!data || data.length < 1) {
        return res.status(200).json({
          message: 'Payment history is empty',
          success: true,
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Fetched successfully',
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
};
