import axios from "axios"
import { useState } from "react"

import RobotForm from "./RobotForm"

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


    // onSubmit handler
    const onSubmit = (robotObject) => {
        const newRobot = {
            model: robotObject.model,
            statusUse: robotObject.statusUse,
            ip: robotObject.ip,
            hostname: robotObject.hostname,
        };

        const token = localStorage.getItem('token');

        axios.post(apiUrl + '/robots/create-robot', newRobot, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('Robot creado exitosamente')
                }
                else {
                    Promise.reject()
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    return (
        <RobotForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Crear Robot
        </RobotForm>
    )

}

export default CreateRobot;