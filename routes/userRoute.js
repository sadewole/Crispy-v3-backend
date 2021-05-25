const router = require('express').Router();
const sanitizer = require('../middlewares/sanitizer');
const userController = require('../controllers/userController');
const Auth = require('../middlewares/auth');

// Routes post signup
// Access public
router.route('/user/signup').post(sanitizer.auth.signup, userController.signup);

// Routes post signin
// Access public
router.route('/user/signin').post(sanitizer.auth.signin, userController.signin);

// Routes get user
// Access private
router.route('/user/me').get(Auth.checkToken, userController.fetchUser);

// Routes get all user
// Access private
router
  .route('/user/all')
  .get(Auth.checkToken, Auth.onlyAdmin, userController.fetchAllUser);

// Routes delete multi user
// Access private
router
  .route('/user/multi')
  .delete(Auth.checkToken, Auth.onlyAdmin, userController.multiDeleteUser);

// Routes GET auth user cart
// Access private
router.route('/user/cart').get(Auth.checkToken, userController.fetchUserCart);

// Routes GET  auth user payment history
// Access private
router
  .route('/user/payment_history')
  .get(Auth.checkToken, userController.fetchUserPaymentHistory);

// Routes POST  user profile
// Access private
router
  .route('/user/profile')
  .get(Auth.checkToken, userController.fetchUserProfile)
  .post(
    Auth.checkToken,
    sanitizer.auth.profile,
    userController.updateUserProfile
  );

// Routes [PUT,GET,DELETE] user by params
// Access private
router
  .route('/user/:id')
  .get(Auth.checkToken, userController.fetchSingleUser)
  .put(Auth.checkToken, Auth.onlyAdmin, userController.upgradeUserRole)
  .delete(Auth.checkToken, Auth.onlyAdmin, userController.deleteSingleUser);

module.exports = router;
