import express from 'express'
import PetController from '../controllers/PetController.mjs'

// Middlewares
import checkToken from '../helpers/verify-token.mjs'

const router = express.Router()

router.post('/create', checkToken, PetController.create)

export default router