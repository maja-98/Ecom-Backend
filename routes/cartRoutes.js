const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartControllers')
const verifyJWT = require('../middlewares/verifyJWT')


router.route('/:username')
    .get([verifyJWT],cartController.getCartDetails)
router.use(verifyJWT)

router.route('/')
    .post(cartController.createCartforUser)
    .patch(cartController.updateCartDetails)
    .delete(cartController.deleteCart)
router.route('/clear')
    .post(cartController.clearCartDetails)

module.exports = router