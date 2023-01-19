import User from '../models/User.mjs'
import bcrypt from "bcrypt"
import createUserToken from '../helpers/create-user-token.mjs'

class UserController {

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

}

export default UserController