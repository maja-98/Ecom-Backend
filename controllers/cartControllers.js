const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')
const Cart = require('../models/Cart')


const getCartDetails = asyncHandler (async (req,res) => {
    const {username} = req.params
    const user = await User.findOne({username}).lean().exec()
    const cart = await Cart.findOne({user:user._id}).lean().exec() ?? undefined
    if (!cart){
        return res.status(400).json({message: 'No Cart found for this User'})
    }
    const itemIds = cart?.items?.map(item => item.itemId)
    const itemObjects =await  Item.find().where('itemId').in(itemIds).lean().exec() ?? []
    const sortedCartItems = cart.items.sort((a,b) => a.itemId - b.itemId)
    const sorteditemObjects = itemObjects.sort((a,b) =>a.itemId - b.itemId)
    const changedItemObjects = sorteditemObjects.map((itemObject,i) => {
        const newItemObject = {...itemObject, cartQuantity: sortedCartItems[i].quantity}
        return newItemObject
    })
    cart.itemObjects = changedItemObjects

    res.json(cart)

})


const createCartforUser = asyncHandler (async (req,res) => {
    const {username} = req.body
    if (!username){
        return res.status(400).json({message:'Username required'})
    }
    const user = await User.findOne({username}).lean().exec()
    const cartObject = {items:[],user:user}
    const existingCart= await Cart.findOne({user}).lean().exec()
    if (existingCart){
        return res.status(409).json({message:'Cart already exists for this user'})
    }
    const cart = await Cart.create(cartObject)
    if (cart){
        res.status(201).json({message:`New Cart created for ${username}`})
    }
    else{
        res.status(400).json({message:"Invalid cart data recieved"})
    }
})
const updateCartDetails = asyncHandler (async (req,res) => {
    const {itemId,discountPrice,deliveryCharge,username,number} = req.body
    if (!username){
        return res.status(400).json({message:'Username is required'})
    }
    const user =  await User.findOne({username}).lean().exec()
    if (!user){
        return res.status(400).json({message:'Wrong username'})
    }
    const cart = await Cart.findOne({user}).exec()
    if (!cart){
        return res.status(400).json({message:'No existing cart for current User'})
    }
    const item = (itemId)!==undefined ? await Item.findOne({itemId}).lean().exec() : undefined
    cart.discountPrice = discountPrice ?? cart.discountPrice
    cart.deliveryCharge = deliveryCharge ?? cart.deliveryCharge
    if (item){
        const existingItem = cart.items.find(item => item.itemId === itemId)
        const changedQuantity = Number(number) !== NaN ? Number(number) : -1
       
        if (changedQuantity<0){
            return res.status(400).json({message:'Invalid new Quanity entered'})
        }
        if (existingItem && changedQuantity >=0){
            existingItem.quantity = changedQuantity
             
            if (existingItem.quantity > item.inventory){
                return res.status(400).json({message:'Inventory not available'})
            }
        }
        else if (existingItem && changedQuantity ==undefined){
             return res.status(400).json({message:'Number required'})
        }
        else{
            if (item.inventory>0){
                cart.items.push({itemId})
            }
            else{
                return res.status(400).json({message:'Inventory not available'})
            }
        }
        if (existingItem && existingItem?.quantity===0){
            const newCartItems = cart.items.filter(r => r.itemId!== existingItem.itemId)
            cart.items = newCartItems
        }
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
    const cart = await Cart.findOne({user}).exec()
    await cart.deleteOne()
    res.json(`Cart of ${username} Deleted`)
})
module.exports = {createCartforUser,getCartDetails,updateCartDetails,deleteCart,clearCartDetails}