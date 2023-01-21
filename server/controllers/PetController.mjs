import Pet from '../models/Pest.mjs'

// helpers
import getToken from '../helpers/get-token.mjs'
import getUserByToken from "../helpers/get-user-by-token.mjs"
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

class PetController {

    // Create a pet
    static async create(req, res) {

        const { name, age, weight, color } = req.body

        const available = true

        // Images upload
        const images = req.files

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

        if(images.length == 0) {
            return res.status(422).json({
                message: "A imagem é obrigatória"
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

        images.map(image => {
            pet.images.push(image.filename)
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

    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt')

        return res.status(200).json({
            pets: pets
        })
    }

    static async getAllUserPets(req, res) {

        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        return res.status(200).json({
            pets
        })

    }

    static async getAllUserAdoptions(req, res) {
        
        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        return res.status(200).json({
            pets
        })

    }

    static async getPetById(req, res) {

        const id = req.params.id

        if(!ObjectId.isValid(id)) {
            return res.status(422).json({
                message: "ID iválido"
            })
        }

        // Check if pet exists
        const pet = await Pet.findOne( { _id: id } )

        if(!pet) {
            return res.status(404).json({
                message: "Pet não encontrado!"
            })
        }

        return res.status(200).json({
            pet
        })
    }

}

export default PetController