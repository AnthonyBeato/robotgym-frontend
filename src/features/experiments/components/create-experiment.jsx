import axios from "axios"
import { useState } from "react"

import ExperimentForm from "./ExperimentForm"
import { jwtDecode } from 'jwt-decode';


const CreateExperiment = () => {
    const [formValues] = useState(
        {
            experimentName: '',
            description: '',
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;

    // Función para obtener el ID del usuario del token JWT
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token'); // Asumiendo que guardaste el token en el localStorage
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        }
        return null;
    }


    // onSubmit handler
    const onSubmit = (experimentObject) => {
        const userId = getUserIdFromToken();

        if (!userId) {
            alert('No se ha encontrado el usuario autenticado');
            return;
        }

        const newExperiment = {
            name: experimentObject.experimentName,
            description: experimentObject.description,
            isActive: false,
            user: userId,
        };

        const token = localStorage.getItem('token');

        axios.post(apiUrl + '/experiments/create-experiment', newExperiment, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('Experimento creado exitosamente')
                }
                else {
                    Promise.reject()
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    return (
        <ExperimentForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Crear Experimento
        </ExperimentForm>
    )

}

export default CreateExperiment;