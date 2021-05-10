const router = require('express').Router();
const mealController = require('../controllers/mealController');
const uploads = require('../middlewares/multer');
const sanitizer = require('../middlewares/sanitizer');
const Auth = require('../middlewares/auth');

// Routes [POST, GET] meal
// Access public
router
  .route('/meal')
  .get(mealController.allMeal)
  .post(
    Auth.checkToken,
    Auth.onlyAdmin,
    sanitizer.mealValidate,
    uploads.single('image'),
    mealController.addMeal
  );

// Routes [PUT,GET,DELETE] meal by params
// Access private to admin
router
  .route('/meal/:id')
  .get(Auth.checkToken, Auth.onlyAdmin, mealController.getSingleFood)
  .put(
    Auth.checkToken,
    Auth.onlyAdmin,
    uploads.single('image'),
    mealController.updateFood
  )
  .delete(Auth.checkToken, Auth.onlyAdmin, mealController.deleteFood);

module.exports = router;
