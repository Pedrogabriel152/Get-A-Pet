import jwt from "jsonwebtoken"
import User from "../models/User.mjs"

// Get user by jwt token
const getUserByToken = async token => {

    if(!token) {
        return res.status(401).json({
            message: 'Acesso negado'
        })
    }

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findById(userId)

    return user
}

export default getUserByToken