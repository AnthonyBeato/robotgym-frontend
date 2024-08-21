import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import RobotForm from "./RobotForm"

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

    // onSubmit handler
    const onSubmit = (robotObject) => {
        const updatedRobot = {
            model: robotObject.model,
            statusUse: robotObject.statusUse,
            ip: robotObject.ip,
            hostname: robotObject.hostname,
        }

        axios.put(
            apiUrl + '/robots/update-robot/' + id, updatedRobot, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    alert('Robot editado exitosamente');
                    navigate("/robots");
                } else
                    Promise.reject()
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        axios.get(
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
        <RobotForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Editar Robot
        </RobotForm>
    )

}

export default EditRobot;