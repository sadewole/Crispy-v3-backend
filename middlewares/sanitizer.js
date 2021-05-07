const { check } = require('express-validator');

module.exports = {
  auth: {
    signup: [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password').not().isEmpty(),
      check('firstName', 'Please enter first name').not().isEmpty(),
      check('lastName', 'Please enter last name').not().isEmpty(),
      check('role', 'Please enter role').not().isEmpty(),
    ],
    signin: [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password').not().isEmpty(),
    ],
  },
  mealValidate: [
    check('name', 'Please enter food name').not().isEmpty(),
    check('price', 'Please enter food price').not().isEmpty(),
  ],
};
