import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

// Input dinamico
import Input from "../../form/Input";

// CSS
import styles from "../../form/Form.module.css"

// Context
import { Context } from "../../../context/UserContext";

function Login() {

    const [user, setUser] = useState({})
    const { login } = useContext(Context)

    function handleOnchange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        // Realizar login do usuário
        login(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    handleOnchange={handleOnchange}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnchange={handleOnchange} 
                />

                <input type="submit" />
            </form>

            <p>
                Não tem conta? <Link to="/register">Cadastrar</Link>
            </p>
        </section>
    )
}

export default Login