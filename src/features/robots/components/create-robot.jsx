import axiosInstance from '../../../instance/axiosIntance';
import { useState } from "react"

import RobotForm from "./RobotForm"
import CustomAlert from "../../../components/CustomAlert";

const CreateRobot = () => {
    const [formValues] = useState(
        {
            model: '',
            statusUse: 'Disponible',
            ip: '',
            hostname: '',
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // onSubmit handler
    const onSubmit = (robotObject) => {
        const newRobot = {
            model: robotObject.model,
            statusUse: robotObject.statusUse,
            ip: robotObject.ip,
            hostname: robotObject.hostname,
        };

        const token = localStorage.getItem('token');

        axiosInstance.post(apiUrl + '/robots/create-robot', newRobot, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 201) {
                    setAlertMessage('Robot creado exitosamente');
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
            <RobotForm
                initialValues={formValues}
                onSubmit={onSubmit}
            >
                Crear Robot
            </RobotForm>
            
            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </>
    )

}

export default CreateRobot;