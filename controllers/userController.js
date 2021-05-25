const User = require('../models/user');
const Order = require('../models/order');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/token');
const {
  findUserById,
  findFullUserById,
  findMealById,
} = require('../middlewares/helpers');

module.exports = {
  /**
   *
   * @param {body} req - request for body parameter(firstName, lastName, email, password, role)
   * @param {*} res - response with the json data
   * @returns
   */
  async signup(req, res) {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      let { firstName, lastName, email, password, role } = req.body;
      email = email.toLowerCase();
      let user = await User.findOne({
        email,
      });

      if (!user) {
        const newUser = await new User({
          firstName,
          lastName,
          email,
          password: bcrypt.hashSync(password, 10),
          role,
        });

        await newUser.save();

        const token = await getToken(newUser);

        return res.status(201).json({
          success: true,
          data: {
            id: newUser._id,
            firstName,
            lastName,
            email,
            role,
          },
          message: 'Signup successfully',
          token,
        });
      }

      return res.status(400).json({
        message: 'User already exist',
        success: false,
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message, success: false });
      }
      return res.status(500).json({ message: 'Server error', success: false });
    }
  },
  /**
   *
   * @param {body} req - request for body parameter( email, password)
   * @param {*} res - response with the json data
   * @returns
   */
  async signin(req, res) {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      let { email, password } = req.body;
      email = email.toLowerCase();
      let userExist = await User.findOne({
        email,
      });

      if (!userExist)
        return res.status(404).json({
          success: false,
          message: 'Incorrect Password or Email',
        });

      const correctPwd = await bcrypt.compare(password, userExist.password);
      if (!correctPwd)
        return res.status(400).json({
          message: 'Incorrect Password or Email',
          success: false,
        });

      const tokenCreated = await getToken(userExist);
      if (tokenCreated)
        return res.status(201).json({
          success: true,
          data: {
            token: tokenCreated,
            id: userExist._id,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            email: userExist.email,
            role: userExist.role,
          },
          message: 'Successfully login',
        });
    } catch (err) {
      return res.status(500).json({ message: err.message, success: false });
    }
  },
  /**
   *
   * @param {decoded} req - request for decoded parameter(id)
   * @param {*} res - response with the json data
   * @returns
   */
  async fetchUser(req, res) {
    const { id } = req.decoded;

    try {
      const data = await findFullUserById(req, res, id);

      return res.status(200).json({
        success: true,
        data,
        message: 'Fetched user successfully',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchAllUser(req, res) {
    try {
      const allUser = await User.find({});

      if (allUser.length) {
        return res.status(200).json({
          success: true,
          data: allUser,
          message: 'Fetched all user successfully',
        });
      }

      return res.status(200).json({
        success: true,
        data: [],
        message: 'No registered user',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchSingleUser(req, res) {
    const { id } = req.params;

    try {
      const userExist = await findUserById(req, res, id);

      const userDetails = {
        id: id,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        role: userExist.role,
        profile: userExist.profile,
      };

      return res.status(200).json({
        success: true,
        data: {
          ...userDetails,
        },
        message: 'Fetched user successfully',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async upgradeUserRole(req, res) {
    const { id } = req.params;
    try {
      await findUserById(req, res, id);
      let updatedUserRole = await User.findByIdAndUpdate(
        id,
        { role: 'ADMIN' },
        { new: true }
      );
      await updatedUserRole.save();

      return res.status(201).json({
        success: true,
        data: {
          id: updatedUserRole._id,
          firstName: updatedUserRole.firstName,
          lastName: updatedUserRole.lastName,
          email: updatedUserRole.email,
          role: updatedUserRole.role,
          profile: updatedUserRole.profile,
        },
        message: 'Updated user successfully',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async deleteSingleUser(req, res) {
    const { id } = req.params;
    try {
      await findUserById(req, res, id);

      await User.findByIdAndDelete(id);
      const order = await Order.findOne({ userId: id });
      await order.remove();

      return res.status(201).json({
        success: true,
        message: 'Deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async multiDeleteUser(req, res) {
    try {
      const unknownId = [];
      const { multiId } = req.body;
      if (!multiId || !multiId.length) {
        return res.status(400).json({
          success: false,
          message: 'multiId should not be empty',
        });
      }
      for (let i = 0; i < multiId.length; i++) {
        let id = multiId[i];
        const userExist = await User.findById(id);
        if (!userExist) unknownId.push(id);
        else {
          await User.findByIdAndDelete(id);
          const order = await Order.findOne({ userId: id });
          await order.remove();
        }
      }

      if (unknownId.length) {
        return res.status(404).json({
          success: false,
          data: unknownId,
          message: 'Unknown ID',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Deleted successfully',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchUserCart(req, res) {
    const { id } = req.decoded;
    try {
      const data = await User.findById(id).populate('carts');

      let cartList = [];
      for (let i = 0; i < data.carts.length; i++) {
        const cart = data.carts[i];
        const food = await findMealById(req, res, cart.mealId);
        cartList = [...cartList, { cart, food }];
      }

      return res.status(200).json({
        success: true,
        message: 'Fetched successfully',
        data: cartList,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchUserPaymentHistory(req, res) {
    const { id } = req.decoded;
    try {
      const data = await User.findById(id).populate('payments');

      return res.status(200).json({
        success: true,
        message: 'Fetched successfully',
        data: data.payments,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async fetchUserProfile(req, res) {
    const { id } = req.decoded;
    try {
      const data = await User.findById(id);

      return res.status(200).json({
        success: true,
        message: 'Fetched successfully',
        data: data.profile,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async updateUserProfile(req, res) {
    try {
      let profileFields = { address: req.body.address, phone: req.body.phone };
      // Using upsert option (creates new doc if no match is found):
      const user = await User.findByIdAndUpdate(
        req.decoded.id,
        { profile: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).select('-password');

      return res.status(201).json({
        success: true,
        message: 'Profile saved successfully',
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
};
