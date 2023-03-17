const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderControllers')
const verifyJWT = require('../middlewares/verifyJWT')


router.route('/:userId')
    .get([verifyJWT],orderController.getOrdersforUser)
router.use(verifyJWT)
router.route('/')
    .get(orderController.getOrderDetails)
    .post(orderController.createOrderforUser)
    .patch(orderController.updateOrderDetails)


module.exports = router