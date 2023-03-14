const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers')
const verifyJWT = require('../middlewares/verifyJWT')


router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
router.route('/:userId')
    .get(userController.getUserById)

module.exports = router