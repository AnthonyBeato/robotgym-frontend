import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import ExperimentForm from "./ExperimentForm"
import axiosInstance from '../../../instance/axiosIntance';

import { jwtDecode } from 'jwt-decode';

const EditExperiment = () => {
    const [formValues, setFormValues] = useState(
        {
            experimentName: '',
            description: '',
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();
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

    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token');

    // Cargar data del server
    useEffect(() => {
        if (!userId) {
            alert('No se ha encontrado el usuario autenticado');
            return;
        }

        axiosInstance.get(
            apiUrl + '/experiments/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                const {
                    name,
                    description,
                } = res.data;
                setFormValues(
                    {
                        experimentName: name,
                        description,
                    }
                );
            })
            .catch(err => console.log(err)
            );
    }, [apiUrl, id, token, userId]);


    // onSubmit handler
    const onSubmit = (experimentObject) => {
        const updatedExperiment = {
            name: experimentObject.experimentName,
            description: experimentObject.description,
        }

        axiosInstance.put(
            apiUrl + '/experiments/update-experiment/' + id, updatedExperiment, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    alert('Experimento editado exitosamente');
                    navigate("/experiments");
                } else
                    Promise.reject()
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    return (
        <ExperimentForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Editar Experimento
        </ExperimentForm>
    )

}

export default EditExperiment;