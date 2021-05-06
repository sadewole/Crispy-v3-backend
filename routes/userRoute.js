const router = require('express').Router();
const sanitizer = require('../middlewares/sanitizer');
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/auth');

// Routes post signup
// Access public
router.route('/user/signup').post(sanitizer.auth.signup, userController.signup);

// Routes post signin
// Access public
router.route('/user/signin').post(sanitizer.auth.signin, userController.signin);

// Routes get user
// Access private
router.route('/user/me').post(checkToken, userController.fetchUser);
