const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartControllers')



router.route('/')

    .post(cartController.createCartforUser)
    .patch(cartController.updateCartDetails)
    .delete(cartController.deleteCart)
router.route('/clear')
    .post(cartController.clearCartDetails)
router.route('/:username')
    .get(cartController.getCartDetails)
module.exports = router