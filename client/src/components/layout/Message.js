import styles from './Message.module.css'
import { useState, useEffect } from 'react';
import bus from '../../utils/bus'

function Message(){

    const [type, setType] = useState("")
    const [message, setMessage] = useState("")
    const [visibilite, setVisibilite] = useState(false)

    useEffect(() => {

        bus.addListener('flash', ({message, type}) => {

            setVisibilite(true)
            setMessage(message)
            setType(type)

            setTimeout(() =>{
                setVisibilite(false)
            }, 3000)

        })

    }, [])

    return(
        visibilite && (
            <div className={`${styles.message} ${styles[type]}`}>
               {message}
            </div>
        )
    );

}

export default Message