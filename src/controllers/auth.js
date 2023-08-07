const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {user} = require('../../models')

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body

        const userLogin = await user.findOne({
            where: {
                username
            }
        })
        if  (!userLogin){
            return res.status(401).send({
                message: 'Username not found'
            })
        }

        const result = await bcyrpt.compare(password, userLogin.password)
        if (!result){
            return res.status(401).send({
                message: 'Wrong password'
            })
        }

        const token = jwt.sign({
            userId: userLogin.id,
        }, process.env.TOKEN_KEY)

        res.status(200).send({
            message: 'Login success',
            data: {
                user: {
                    username:  userLogin.username,
                },
                token
            }
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}