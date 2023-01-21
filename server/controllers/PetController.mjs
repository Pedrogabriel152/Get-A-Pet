import Pet from '../models/Pest.mjs'

// helpers
import getToken from '../helpers/get-token.mjs'
import getUserByToken from "../helpers/get-user-by-token.mjs"

class PetController {

    // Create a pet
    static async create(req, res) {

        const { name, age, weight, color } = req.body

        const available = true

        // Images upload

        // Validations
        if(!name) {
            return res.status(422).json({
                message: "O nome é obrigatório"
            })
        }

        if(!age) {
            return res.status(422).json({
                message: "A idade é obrigatória"
            })
        }

        if(!weight) {
            return res.status(422).json({
                message: "O peso é obrigatório"
            })
        }

        if(!color) {
            return res.status(422).json({
                message: "A cor é obrigatória"
            })
        }

        // Get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // Create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                image: user.image,
                phone: user.phone
            },
        })

        try {
            
            const newPet = await pet.save()
            return res.status(201).json({
                message: "Pet cadastrado com sucesso",
                newPet
            })

        } catch (error) {
            
            return res.status(500).json({
                message: error
            })

        }

    }

}

export default PetController