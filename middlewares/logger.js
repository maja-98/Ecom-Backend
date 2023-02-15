const {format} = require('date-fns')
const {v4: uuid}= require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message,logFileName) => {
    const dateTime = `${format(new Date(),'yyyy-MM-dd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${message}\n`
    const filePath = path.join(__dirname,'..','logs')
    try{
        if(!fs.existsSync(filePath)){
            await fsPromises.mkdir(filePath)
        }
        fsPromises.appendFile(path.join(filePath,logFileName),logItem)
    }
    catch(err){
        console.log(err)

    }
}
const logger = (req,res,next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin ?? 'None'}`,`reqLog_${format(new Date(),'yyyyMMdd')}.log`)
    console.log(`${req.method}\t${req.path}`)
    next()
}
module.exports = {logEvents,logger}