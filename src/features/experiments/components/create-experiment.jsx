import axiosInstance from '../../../instance/axiosIntance';
import ExperimentForm from "./ExperimentForm"
import { jwtDecode } from 'jwt-decode';
import CustomAlert from "../../../components/CustomAlert";
import { useState } from "react"

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

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // onSubmit handler
    const onSubmit = (experimentObject) => {
        const userId = getUserIdFromToken();

        if (!userId) {
            setAlertMessage("No se ha encontrado el usuario autenticado");
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        const newExperiment = {
            name: experimentObject.experimentName,
            description: experimentObject.description,
            isActive: false,
            user: userId,
        };

        const token = localStorage.getItem('token');

        axiosInstance.post(apiUrl + '/experiments/create-experiment', newExperiment, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 201) {
                    setAlertMessage('Experimento creado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                }
                else {
                    Promise.reject()
                }
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
                Crear Experimento
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

export default CreateExperiment;