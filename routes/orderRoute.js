const router = require('express').Router();
const orderController = require('../controllers/orderController');
const Auth = require('../middlewares/auth');

router
  .route('/order')
  .get(Auth.checkToken, Auth.onlyAdmin, orderController.getAllOrder)
  .post(Auth.checkToken, Auth.onlyAdmin, orderController.addNewOrder);

router
  .route('/order/:id')
  .get(orderController.getSingleOrder)
  //   .put(Auth.checkToken, orderController.updateQuantity)
  .delete(Auth.checkToken, orderController.deleteOrder);

module.exports = router;
