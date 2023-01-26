import React from "react";
import { useEffect, useState } from "react";

// API
import api from '../../../utils/api'

// Input dinamico
import Input from '../../form/Input'

// CSS
import styles from './Profile.module.css'
import formStyles from '../../form/Form.module.css'

// FlashMessage
import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from "../../layout/RoundedImage";

function Profile() {

    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    const [ token ] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {

        api.get('/user/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then( res => {
            setUser(res.data)
        })

    }, [token])


    function onFileChange(e) {
        setPreview(e.target.files[0])
        setUser({ ...user, [e.target.name]: e.target.files[0] })

        if(preview){
            console.log('tem preview')
        }
    }

    function handleOnchange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(user).forEach( key => formData.append(key, user[key])) 

        const data = await api.patch(`/user/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then( res => {
            return res.data
        })
        .catch(err => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)

    }

    return(
        <section>
            <div className={styles.profile_container}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                   <RoundedImage src={
                                    preview ? 
                                        URL.createObjectURL(preview) : 
                                        `${process.env.REACT_APP_API}/images/users/${user.image}`} 
                        alt={user.name}
                    />
                )}
            </div>
            <form className={formStyles.form_container} onSubmit={handleSubmit}>
                <Input
                    text="Image"
                    type="file"
                    name="image"
                    handleOnchange={onFileChange}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu E-mail"
                    handleOnchange={handleOnchange}
                    value={user.email || ''}
                />
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu Nome"
                    handleOnchange={handleOnchange}
                    value={user.name || ''}
                />
                <Input
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnchange={handleOnchange}
                    value={user.phone || ''}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnchange={handleOnchange}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme sua senha"
                    handleOnchange={handleOnchange}
                />

                <input type="submit" value="Editar" />
            </form>
        </section>
    );
}

export default Profile