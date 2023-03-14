const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderControllers')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)
router.route('/')
    .get(orderController.getOrderDetails)
    .post(orderController.createOrderforUser)
    .patch(orderController.updateOrderDetails)
router.route('/:userId')
    .get(orderController.getOrdersforUser)

module.exports = router