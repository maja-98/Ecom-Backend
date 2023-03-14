const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemControllers')
const verifyJWT = require('../middlewares/verifyJWT')


router.route('/')
    .get(itemController.getAllItems)

router.route('/:itemId').get(itemController.getItembyItemId)
router.route('/id/:Id').get(itemController.getItemById)
router.route('/category/:category').get(itemController.getItemByCategory)

router.use(verifyJWT)

router.route('/')
    .post(itemController.createNewItem)
    .patch(itemController.updateItem)
    .delete(itemController.deleteItem)
module.exports = router