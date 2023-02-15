const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartControllers')



router.route('/')
    .get(cartController.getCartDetails)
    .post(cartController.createCartforUser)
    .patch(cartController.updateCartDetails)
    .delete(cartController.deleteCart)
router.route('/clear')
    .post(cartController.clearCartDetails)
module.exports = router