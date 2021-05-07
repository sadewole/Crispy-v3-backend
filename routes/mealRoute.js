const router = require('express').Router();
const mealController = require('../controllers/mealController');
const uploads = require('../middlewares/multer');
const sanitizer = require('../middlewares/sanitizer');
const Auth = require('../middlewares/auth');

// Routes [post, get] meal
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

router
  .route('/menu/:id')
  .get(Auth.checkToken, Auth.onlyAdmin, mealController.getSingleFood)
  .put(
    Auth.checkToken,
    Auth.onlyAdmin,
    uploads.single('image'),
    mealController.updateFood
  )
  .delete(Auth.checkToken, Auth.onlyAdmin, mealController.deleteFood);

module.exports = router;
