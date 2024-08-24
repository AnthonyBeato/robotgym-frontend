import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import ExperimentForm from "./ExperimentForm"
import axiosInstance from '../../../instance/axiosIntance';

import { jwtDecode } from 'jwt-decode';
import CustomAlert from "../../../components/CustomAlert";

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
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token');

    // Cargar data del server
    useEffect(() => {
        if (!userId) {
            setAlertMessage("No se ha encontrado el usuario autenticado");
            setAlertSeverity('error');
            setAlertOpen(true);
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
                    setAlertMessage('Experimento editado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    setTimeout(() => {
                        navigate("/experiments");
                    }, 1500);
                } else
                    Promise.reject()
            })
            .catch((error) => {
                setAlertMessage("Algo ha salido mal: " + error.message);
                setAlertSeverity('error');
                setAlertOpen(true);
            });
    }

    return (
        <>
            <ExperimentForm
                initialValues={formValues}
                onSubmit={onSubmit}
            >
                Editar Experimento
            </ExperimentForm>
            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </>
    )

}

export default EditExperiment;