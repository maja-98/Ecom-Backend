const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderControllers')



router.route('/')
    .get(orderController.getOrderDetails)
    .post(orderController.createOrderforUser)
    .patch(orderController.updateOrderDetails)
router.route('/:userId')
    .get(orderController.getOrdersforUser)

module.exports = router