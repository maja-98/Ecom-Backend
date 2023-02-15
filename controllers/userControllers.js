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
const createNewUser = asyncHandler (async (req,res) => {
    const {username,password,role} = req.body
    if(!username || !password  ){
        return res.status(400).json({message:'All fields are required'})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:'User name already exists'})
    }
    const hashPwd = await bcrypt.hash(password,10)
    const userObject = {username,"password":hashPwd,role:role}
    const user = await User.create(userObject)
    if (user){
        res.status(201).json({message:`New User ${username} created`})
    }
    else{
        res.status(400).json({message:"Invalid user data recieved"})
    }
})
const updateUser = asyncHandler (async (req,res) => {
    const {id,username,role,active,password} = req.body
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
module.exports = {getAllUsers,createNewUser,updateUser,deleteUser}