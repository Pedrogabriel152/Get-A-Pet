import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../assets/img/logo.png'
import { useContext } from "react";

// CSS
import styles from './Navbar.module.css'

// Context
import { Context } from "../../context/UserContext";

function Navbar() {

    const { authenticate, logout } = useContext(Context)

    return(
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Get A Pet"/>
                <h2>Get A Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>

                {authenticate ? (
                    <>
                        <li>
                            <Link to="/user/profile">Perfil</Link>
                        </li>
                        <li onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Entrar</Link>
                        </li>
                        <li>
                            <Link to="/register">Cadastrar</Link>
                        </li>
                    </>
                )}
                
            </ul> 
        </nav>
    );
}

export default Navbar