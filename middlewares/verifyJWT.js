const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next) => {
    const {userId:paramUserId,username:paramsUserName} = req.params
    const authHeader = req.headers.authorization || req.headers.Authorization
    const {username:bodyUsername,userId:bodyUserId} = req.body
    if (!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message:'Unauthorized'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) => {
            if (err) return res.status(403).json({message:'Forbidden'})
            req.username = decoded.UserInfo.username
            req.role = decoded.UserInfo.role
            req.userId = decoded.UserInfo.userId
            if (req.role==='Admin'){
                next()
            }
            else if ((req.method==='GET' && req.baseUrl==='/api/users' && !req.params) ){
                return res.status(401).json({message:'Unauthorized'})
            }
            else if ((req.username===bodyUsername)||(req.userId===bodyUserId)||(req.userId ===paramUserId)||req.username===paramsUserName){
                next()
            }
            else{
                return res.status(401).json({message:'Unauthorized'})
            }
            
        }
    )
}

module.exports = verifyJWT