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
router.route('/user/me').post(Auth.checkToken, userController.fetchUser);

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

// Routes [PUT,GET,DELETE] user by params
// Access private
router
  .route('/user/:id')
  .get(Auth.checkToken, userController.fetchSingleUser)
  .put(Auth.checkToken, Auth.onlyAdmin, userController.upgradeUserRole)
  .delete(Auth.checkToken, Auth.onlyAdmin, userController.deleteSingleUser);

// Routes GET user cart by params
// Access private
router
  .route('/user/:id/cart')
  .get(Auth.checkToken, userController.fetchUserCart);

// Routes GET user order history by params
// Access private
router
  .route('/user/:id/order_history')
  .get(Auth.checkToken, userController.fetchOrderHistory);

module.exports = router;
