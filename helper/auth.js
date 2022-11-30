const jwt = require('jsonwebtoken')
const responseMessages = require('../constants/responseMessages')

const auth = function(req, res, next){
    let token = (req.headers.authorization)

    if(token){
        jwt.verify(token, 'secret', (err, verifiedJwt) => {
            if(err){
                res.status(responseMessages.unauthorized.code).json({
                    message: responseMessages.unauthorized.message
                })
            }else{
                req.id = verifiedJwt.id
                next()
            }
        })
    }else{
        res.status(responseMessages.unauthorized.code).json({
            message: responseMessages.unauthorized.message
        })
    }
}

module.exports = auth
