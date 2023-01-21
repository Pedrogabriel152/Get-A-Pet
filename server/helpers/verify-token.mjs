import jwt from 'jsonwebtoken'
import getToken from './get-token.mjs'

// middleware to validate token
const checkToken = (req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(401).json({
            message: 'Acesso negado'
        })
    }

    const token = getToken(req)

    console.log(token)

    if(!token) {
        return res.status(401).json({
            message: 'Acesso negado'
        })
    }

    try{

        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()

    } catch(err) {
        return res.status(400).json({
            message: 'Token invalido'
        })
    }

}

export default checkToken