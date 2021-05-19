const { check } = require('express-validator');

module.exports = {
  auth: {
    signup: [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password').not().isEmpty(),
      check('firstName', 'Please enter first name').not().isEmpty(),
      check('lastName', 'Please enter last name').not().isEmpty(),
    ],
    signin: [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password').not().isEmpty(),
    ],
    profile: [
      check('phone', 'Phone number is required').isEmail(),
      check('address', 'Address is required').not().isEmpty(),
    ],
  },
  mealValidate: [
    check('name', 'Please enter food name').not().isEmpty(),
    check('price', 'Please enter food price').not().isEmpty(),
  ],
  orderValidate: [
    check('mealId', 'Must not be empty').not().isEmpty(),
    check('quantity', 'Must not be empty').not().isEmpty(),
  ],
};
