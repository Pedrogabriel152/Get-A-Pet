import express from 'express'
import PetController from '../controllers/PetController.mjs'

// Middlewares
import checkToken from '../helpers/verify-token.mjs'
import imageupload from "../helpers/image-upload.mjs";

const router = express.Router()

router.post(
    '/create', 
    checkToken, 
    imageupload.array('images'), 
    PetController.create
)
router.get('/mypets',checkToken, PetController.getAllUserPets)
router.get('/myadoptions', checkToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id', checkToken, PetController.deletePetById)
router.patch('/:id', checkToken, imageupload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', checkToken, PetController.schedule)
router.patch('/conclude/:id', checkToken, PetController.concludeAdoption)
router.get('/', PetController.getAll)

export default router