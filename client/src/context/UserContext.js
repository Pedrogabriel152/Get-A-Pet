import { createContext } from 'react'

import useAuth from '../hooks/userAuth';

const Context = createContext()

function UserProvider({children}) {

    const { authenticate, register, logout, login } = useAuth()

    return(
        <Context.Provider value={{ authenticate, register, logout, login }}>
          {children}  
        </Context.Provider>
    );

}

export { Context, UserProvider }