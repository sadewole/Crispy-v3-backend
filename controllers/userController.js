const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/token');

module.exports = {
  async signup(req, res) {
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

      const token = getToken(newUser);

      return res.status(201).json({
        method: 'POST',
        success: true,
        data: {
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
  },
};
