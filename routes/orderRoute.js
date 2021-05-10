const router = require('express').Router();
const orderController = require('../controllers/orderController');
const Auth = require('../middlewares/auth');
const sanitizer = require('../middlewares/sanitizer');

// Routes [POST,GET] order
// Access private
router
  .route('/order')
  .get(Auth.checkToken, Auth.onlyAdmin, orderController.getAllOrder)
  .post(Auth.checkToken, sanitizer.orderValidate, orderController.addNewOrder);

/** PAYMENT */

// Routes [POST,GET] payment
// Access private by ADMIN
router
  .route('/order/payment')
  .get(
    Auth.checkToken,
    Auth.onlyAdmin,
    orderController.fetchAllPaymentHistories
  )
  .post(Auth.checkToken, orderController.userOrderPayment);

// Routes [PUT,GET] order by params
// Access private
router
  .route('/order/payment/:id')
  .get(
    Auth.checkToken,
    Auth.onlyAdmin,
    orderController.fetchSingleOrderDelivery
  )
  .put(Auth.checkToken, Auth.onlyAdmin, orderController.updateOrderDelivery);

/** --> payment  end */

// Routes [PUT,GET,DELETE] order by params
// Access private
router
  .route('/order/:id')
  .get(orderController.getSingleOrder)
  .put(Auth.checkToken, orderController.updateQuantity)
  .delete(Auth.checkToken, orderController.deleteOrder);

module.exports = router;
