import axios from "axios"
import { useState } from "react"

import RobotForm from "./RobotForm"

const CreateRobot = () => {
    const [formValues, setFormValues] = useState(
        {
            model: '',
            statusUse: 'Disponible',
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;


    // onSubmit handler
    const onSubmit = (robotObject) => {
        const newRobot = {
            model: robotObject.model,
            statusUse: robotObject.statusUse,
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
            .catch(err => alert('Algo ha salido mal'))
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