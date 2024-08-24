import axiosInstance from '../../../instance/axiosIntance';
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import RobotForm from "./RobotForm"
import CustomAlert from "../../../components/CustomAlert";

const EditRobot = () => {
    const [formValues, setFormValues] = useState(
        {
            model: '',
            statusUse: 'Disponible',
            ip: '',
            hostname: '',
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_HOST;

    const token = localStorage.getItem('token');

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // onSubmit handler
    const onSubmit = (robotObject) => {
        const updatedRobot = {
            model: robotObject.model,
            statusUse: robotObject.statusUse,
            ip: robotObject.ip,
            hostname: robotObject.hostname,
        }

        axiosInstance.put(
            apiUrl + '/robots/update-robot/' + id, updatedRobot, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Robot editado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    setTimeout(() => {
                        navigate("/robots");
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

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        axiosInstance.get(
            apiUrl + '/robots/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                const {
                    model,
                    statusUse,
                    ip,
                    hostname,
                } = res.data;
                setFormValues(
                    {
                        model,
                        statusUse,
                        ip,
                        hostname,
                    }
                );
            })
            .catch(err => console.log(err)
            );
    }, [apiUrl, id, token]);

    return (
        <>
            <RobotForm
                initialValues={formValues}
                onSubmit={onSubmit}
            >
                Editar Robot
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

export default EditRobot;