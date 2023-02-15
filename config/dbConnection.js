const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const connectDB = async () =>{
    try{
        mongoose.connect(process.env.DATABASE_URI)
        
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB