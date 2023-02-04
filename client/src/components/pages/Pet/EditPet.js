import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

// CSS
import styles from './AddPet.module.css'

// Pet form 
import PetForm from "../../form/PetForm";

// Hooks
import useFlashMessege from "../../../hooks/useFlashMessage";


function EditPet() {

    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { id } = useParams() 
    const { setFlashMessage } = useFlashMessege()


    useEffect(() => {

        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(res => {
            setPet(res.data.pet)
        })

    }, [token, id])

    async function updatePet(pet) {

    }

    return(
        <section>
            <div className={styles.addpet_header}>
                <h1>Editando o Pet: {pet.name}</h1>
                <p>Depois da edição  os dados serão atualizados no sistema</p>
            </div>
            {pet.name && (
                <PetForm 
                    handleSubmit={() => updatePet(pet)}
                    btnText="Atualizar"
                    petData={pet}
                />
            )}
        </section>
    );
}

export default EditPet