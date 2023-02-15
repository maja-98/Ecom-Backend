const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderControllers')



router.route('/')
    .get(orderController.getOrderDetails)
    .post(orderController.createOrderforUser)
    .patch(orderController.updateOrderDetails)

module.exports = router