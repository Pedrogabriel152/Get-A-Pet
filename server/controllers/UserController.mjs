import User from '../models/User.mjs'
import bcrypt from "bcrypt"
import { verify } from 'jsonwebtoken'

// helpers
import createUserToken from '../helpers/create-user-token.mjs'
import getToken from '../helpers/get-token.mjs'
import getUserByToken from '../helpers/get-user-by-token.mjs'

class UserController {

    // Registering a user
    static async register(req, res){

        const { name, email, phone, password, confirmpassword } = req.body

        // Validations
        if(!name) {
            res.status(422).json({
                message: 'O nome é obrigatorio'
            })
            return
        }
        
        if(!email) {
            res.status(422).json({
                message: 'O email é obrigatorio'
            })
            return
        }

        if(!phone){
            res.status(422).json({
                message: 'O telefone é obrigatorio'
            })
            return
        }

        if(!password){
            res.status(422).json({
                message: 'A senha é obrigatoria'
            })
            return
        }

        if(!confirmpassword){
            res.status(422).json({
                message: 'A confirmação de senha é obrigatoria'
            })
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({
                message: 'As senhas precisam ser iguai'
            })
            return
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email })

        if(userExists){
            res.status(422).json({
                message: 'Email já está cadastrado'
            })
            return
        }

        // Create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try{

            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)

        } catch(err){
            res.status(500).json({
                message: err
            })
        }

    }

    // Logging user
    static async login(req, res) {

        const { email, password } = req.body

        // Validations
        if(!email) {
            res.status(422).json({
                message: 'O email é obrigatorio'
            })
            return
        }

        if(!password){
            res.status(422).json({
                message: 'A senha é obrigatoria'
            })
            return
        }

        // Check if user exists
        const user = await User.findOne({ email: email })

        if(!user){
            res.status(404).json({
                message: 'Usuário não encontrado'
            })
            return
        }

        // Check if password match with db password
        const CheckPassword = await bcrypt.compare(password, user.password)

        if(!CheckPassword) {
            res.status(422).json({
                message: 'Senha invalida'
            })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = verify(token, 'nossosecret')
            console.log(decoded.id)

            currentUser = await User.findById(decoded.id)
            console.log(currentUser.password)
            currentUser.password = undefined

        } else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {

        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(404).json({
                message: 'Usuário não encontrado'
            })
            return
        }

        res.status(200).json({ user })
    
    }

    static async editUser(req, res) {

        const id = req.params.id

        // Check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if(req.file) {
            user.image = req.file.filename
        }

        // Validations
        if(!name) {
            res.status(422).json({
                message: 'O nome é obrigatorio'
            })
            return
        }

        user.name = name
        
        if(!email) {
            res.status(422).json({
                message: 'O email é obrigatorio'
            })
            return
        }

        // Check if email has already token
        const userExists = await User.findOne({ email: email })

        if(user.email !== email && userExists) {
            res.status(404).json({
                message: 'Por favor utilize outro e-mail'
            })
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({
                message: 'O telefone é obrigatorio'
            })
            return
        }

        user.phone = phone

        if(password != confirmpassword) {
            res.status(422).json({
                message: 'As senhas precisam ser iguais'
            })
            return

        } else if(password === confirmpassword && password != null) {

            // Create a password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try{

            // return user updated data
            await User.findOneAndUpdate(
                { _id: user.id },
                {$set: user},
                {new: true}
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso'
            })

        }catch(err){

            return res.status(500).json({
                message: err
            })

        }
    }

}

export default UserController