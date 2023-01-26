import api from "../utils/api";

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessege from './useFlashMessage'
import Login from "../components/pages/Auth/Login";

export default function useAuth() {

    const { setFlashMessage } = useFlashMessege()
    const [authenticate, setAuthenticate] = useState(false)
    const history = useNavigate()

    // Verificar se o usuario está autenticado
    useEffect(() => {

        const token = localStorage.getItem('token')

        // Setar a Autorização de token no header da api
        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticate(true)
        }

    }, [])

    // Registrar usuário no sistema
    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {

            const data = await api.post('/user/register', user).then( res => {

                return res.data

            })

            await authUser(data)
            
        } catch (error) {
            
            // Tratar erro
            msgText = error.response.data.message
            msgType = 'error'

        }

        setFlashMessage(msgText, msgType)

    }

    // Realizando o login do usuário
    async function authUser(data) {

        setAuthenticate(true)

        localStorage.setItem('token', JSON.stringify(data.token))

        history('/')
    }

    async function login(user){

        let msgText = 'Login realizado com sucesso'
        let msgType = 'success'

        try {
            
            const data = await api.post('/user/login', user).then(res => {
                return res.data
            })

            await authUser(data)

        } catch (error) {
            
            msgText = error.response.data.message
            msgType = 'error'

        }

        setFlashMessage(msgText, msgType)
    }

    // Realizando o logout do usuário
    function logout() {

        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'

        setAuthenticate(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined

        history('/')

        setFlashMessage(msgText, msgType, logout)

    }

    return { authenticate, logout, register, login }
}