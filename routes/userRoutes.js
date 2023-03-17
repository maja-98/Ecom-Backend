const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers')
const verifyJWT = require('../middlewares/verifyJWT')

router.route('/').post(userController.createNewUser)
router.route('/:userId')
    .get([verifyJWT],userController.getUserById)
router.use(verifyJWT)
router.route('/')
    .get(userController.getAllUsers)   
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router