import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"

import Input from "../../form/Input";
import styles from "../../form/Form.module.css"

// Context
import { Context } from "../../../context/UserContext";

function Register() {

    const [user, setUser] = useState({})
    const { register } = useContext(Context)

    function handleOnchange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        // enviar usuário para o banco
        register(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Registrar</h1>

            <form onSubmit={handleSubmit}>
                <Input 
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnchange={handleOnchange}
                />
                <Input 
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnchange={handleOnchange}
                />
                <Input 
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnchange={handleOnchange}
                />
                <Input 
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnchange={handleOnchange}
                />
                <Input 
                    text="Confirme a Senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnchange={handleOnchange}
                />
                <input type="submit" value="Cadastrar"/>
                
            </form>

            <p>Já tem conta? <Link to="/login">Clique aqui.</Link></p>
        </section>
    );
}

export default Register