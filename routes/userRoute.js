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

// Routes [PUT,GET,DELETE] user
// Access private
router
  .route('/user/:id')
  .get(Auth.checkToken, userController.fetchSingleUser)
  .put(Auth.checkToken, Auth.onlyAdmin, userController.upgradeUserRole)
  .delete(Auth.checkToken, Auth.onlyAdmin, userController.deleteSingleUser);

module.exports = router;
