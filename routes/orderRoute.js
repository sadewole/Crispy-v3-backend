const router = require('express').Router();
const orderController = require('../controllers/orderController');
const Auth = require('../middlewares/auth');

// Routes [POST,GET] order
// Access private
router
  .route('/order')
  .get(Auth.checkToken, Auth.onlyAdmin, orderController.getAllOrder)
  .post(Auth.checkToken, orderController.addNewOrder);

// Routes [PUT,GET,DELETE] order by params
// Access private
router
  .route('/order/:id')
  .get(orderController.getSingleOrder)
  .put(Auth.checkToken, orderController.updateQuantity)
  .delete(Auth.checkToken, orderController.deleteOrder);

// Payment
// Routes [POST,GET] order by params
// Access private
router
  .route('/order/payment')
  .get(Auth.checkToken, Auth.onlyAdmin, orderController.fetchAllOrderHistories)
  .post(Auth.checkToken, orderController.userOrderPayment);

router
  .route('/order/payment/:id')
  .get(
    Auth.checkToken,
    Auth.onlyAdmin,
    orderController.fetchSingleOrderDelivery
  )
  .put(Auth.checkToken, Auth.onlyAdmin, orderController.updateOrderDelivery);

module.exports = router;
