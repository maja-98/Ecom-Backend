const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')
const Cart = require('../models/Cart')


const getCartDetails = asyncHandler (async (req,res) => {
    const {username} = req.body
    const user = await User.findOne({username}).lean().exec()
    const cart = await Cart.findOne({user}).lean().exec()
    if (!cart){
        return res.status(400).json({message: 'No Cart found for this User'})
    }
    res.json(cart)

})
const createCartforUser = asyncHandler (async (req,res) => {
    const {username} = req.body
    if (!username){
        return res.status(400).json({message:'Username required'})
    }
    const user = await User.findOne({username}).lean().exec()
    const cartObject = {items:[],user:user}
    const cart = await Cart.create(cartObject)
    if (cart){
        res.status(201).json({message:`New Cart created for ${username}`})
    }
    else{
        res.status(400).json({message:"Invalid cart data recieved"})
    }
})
const updateCartDetails = asyncHandler (async (req,res) => {
    const {itemId,discountPrice,deliveryCharge,username} = req.body

    const user = await User.findOne({username}).lean().exec()
    const cart = await Cart.findOne({user}).exec()
    const item = await Item.findOne({itemId}).lean().exec()

    cart.discountPrice = discountPrice ?? cart.discountPrice
    cart.deliveryCharge = deliveryCharge ?? cart.deliveryCharge
    if (item){
        cart.items.push(item)
    }
    await cart.save()
    res.json({message:`Cart of ${username} updated`})
})
const clearCartDetails = asyncHandler (async (req,res) => {
    const {username} = req.body
    if (!username){
        return res.status(400).json({message:'Username required'})
    }
    const user = await User.findOne({username}).lean().exec()
    const cart = await Cart.findOne({user}).exec()
    cart.items = []
    cart.discountPrice = 0
    cart.deliveryCharge = 0
    await cart.save()
    res.json({message:`Cart of ${username} Cleared`})
})
const deleteCart = asyncHandler (async (req,res) => {
    const {username} = req.body
    if (!username){
        return res.status(400).json({message:'Username required'})
    }
    const user = await User.findOne({username}).lean().exec()
    const cart = await Cart.findOne({user}).lean().exec()
    await cart.deleteOne()
    res.json(`Cart of ${username} Deleted`)
})
module.exports = {createCartforUser,getCartDetails,updateCartDetails,deleteCart,clearCartDetails}