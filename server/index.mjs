import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.mjs'
import PetRoutes from './routes/PetRoutes.mjs'

const app = express()

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// Public folder for images
app.use(express.static('public'))

// Routes
app.use('/user', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000, () => console.log('Estamos no back'))