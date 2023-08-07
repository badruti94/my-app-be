const jwt = require('jsonwebtoken')

exports.isLogin = (req, res, next) => {

    const authorizationHeader = req.header('Authorization')
    if (!authorizationHeader) {
        return res.status(401).send({
            message: 'Token not found'
        })
    }

    const token = authorizationHeader.split(' ')[1]
    try {
        jwt.verify(token, process.env.TOKEN_KEY)
        next()
    } catch (error) {
        res.status(401).send({
            message: 'Invalid token'
        })
    }
}