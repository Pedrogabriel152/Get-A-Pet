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
                name: user.name,
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

    static async deletePetById(req, res) {

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

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if(pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({
                message: "Houve um problema em processar a sua solicitação, tente  novamente"
            })
        }

        try {
            
            await Pet.findByIdAndRemove(id)

            return res.status(200).json({
                message: "Pet removido com sucesso"
            })

        } catch (error) {
            
            return res.status(500).json({
                message: error
            })

        }

    }

    static async updatePet(req, res) {
        
        const id = req.params.id

        const { name, age, weight, color, available } = req.body

        // Images upload
        const images = req.files

        const updateData = {}

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

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if(pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({
                message: "Houve um problema em processar a sua solicitação, tente  novamente"
            })
        }

        // Validations
        if(!name) {
            return res.status(422).json({
                message: "O nome é obrigatório"
            })
        }

        updateData.name = name

        if(!age) {
            return res.status(422).json({
                message: "A idade é obrigatória"
            })
        }

        updateData.age = age

        if(!weight) {
            return res.status(422).json({
                message: "O peso é obrigatório"
            })
        }

        updateData.weight = weight

        if(!color) {
            return res.status(422).json({
                message: "A cor é obrigatória"
            })
        }

        updateData.color = color

        if(images.length > 0) {
            updateData.images = []
            images.map(image => updateData.images.push(image.filename))
        }
        
        await Pet.findByIdAndUpdate(id, updateData)

        return res.status(200).json({
            message: "Pet atualizado com sucesso"
        })

    }

    static async schedule(req, res) {

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

        // Check if user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if(pet.user._id.equals(user._id)) {
            return res.status(422).json({
                message: "Você não pode agendar uma visita para o seu próprio Pet"
            })
        }

        // Check if user has already scheduled a visit

        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                return res.status(422).json({
                    message: "Você já agendou uma visita a este Pet"
                })
            }
        }

        // ADD user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image 
        }

        await Pet.findByIdAndUpdate(id, pet)

        return res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })
        
    }

    static async concludeAdoption(req, res) {

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

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)


        if(pet.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({
                message: "Houve um problema em processar a sua solicitação, tente  novamente"
            })
        }

        pet.available = false 

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabéns! o ciclo de adoção foi finalizado com sucesso'
        })

    }

}

export default PetController