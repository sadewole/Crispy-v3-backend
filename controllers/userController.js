const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/token');

module.exports = {
  async signup(req, res) {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, role } = req.body;

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
          method: 'POST',
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
      });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  async signin(req, res) {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      let userExist = await User.findOne({
        email,
      });

      if (!userExist)
        return res.status(404).send({
          success: false,
          message: 'User does not Exist! Kindly Register',
        });

      const correctPwd = await bcrypt.compare(password, userExist.password);
      if (!correctPwd)
        return res.status(400).send({
          message: 'Incorrect Password or Email',
        });

      const tokenCreated = await getToken(userExist);
      if (tokenCreated)
        return res.status(200).send({
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
      return res.status(500).json({ message: err.message });
    }
  },
  async fetchUser(req, res) {
    return res.status(200).json({ message: 'Looks good here' });
  },
};
