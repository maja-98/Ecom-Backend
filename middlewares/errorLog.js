const {logEvents} = require('./logger')
const {format} = require('date-fns')

const errorHandler = (err,req,res,next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,`errorLog_${format(new Date(),'yyyyMMdd')}.log`)
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)
    res.json({message:err.message})
}
module.exports = {errorHandler}