const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


const getAllUsers = asyncHandler (async (req,res) => {
    const users = await User.find().select('-password').lean()
    
    if (!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})
const getUserById = asyncHandler (async (req,res) => {
    const users = await User.findById(req.params.userId)
    if (!users){
        return res.status(400).json({message: 'No user found'})
    }
    res.json(users)
})
const createNewUser = asyncHandler (async (req,res) => {
    let {username,role,password,addressLine1,addressLine2,pincode,phone,email} = req.body
    username = username.trim()
    if(!username || !password || !phone ){
        return res.status(400).json({message:'All fields are required'})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:'User name already exists'})
    }
    const hashPwd = await bcrypt.hash(password,10)
    const userObject = {username,"password":hashPwd,role:role,addressLine1,addressLine2,pincode,phone,email}
    const user = await User.create(userObject)
    if (user){
        res.status(201).json({message:`New User ${username} created`})
    }
    else{
        res.status(400).json({message:"Invalid user data recieved"})
    }
})
const updateUser = asyncHandler (async (req,res) => {
    let {id,username,role,active,password,addressLine1,addressLine2,pincode,phone,email,wallet} = req.body
    username = username.trim()
    const user = await User.findById(id).exec()
    if (!user){
        res.status(400).json({message:"User not Found"})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({message:'User name already exists'})
    }
    user.username = username ?? user.username
    user.role = role ?? user.role
    user.active = active ?? user.active
    user.addressLine1 = addressLine1 ?? user.addressLine1
    user.addressLine2 = addressLine2 ?? user.addressLine2
    user.pincode = pincode ?? user.pincode
    user.phone = phone ?? user.phone
    user.email = email ?? user.email
    user.wallet = wallet ?? user.wallet
    if (password){
        user.password = await bcrypt.hash(password,10)
    }
    const updatedUser = await user.save()
    res.json({message:`${updatedUser.username} updated`})
})
const deleteUser = asyncHandler (async (req,res) => {
    const {id} = req.body
    if (!id){
        return res.status(400).json({message:'User Id required'})
    }
    const user = await User.findById(id).exec()
    if (!user){
        return res.status(409).json({message:'User not found'})
    }
    const result = await user.deleteOne()
    res.json(`User ${result.username} Deleted`)
})
module.exports = {getAllUsers,createNewUser,updateUser,deleteUser,getUserById}