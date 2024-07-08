import axios from "axios"
import { useState } from "react"

import UserForm from "./UserForm"

const CreateUser = (props) => {
    const isRegistering = props.isRegistering;

    const [formValues, setFormValues] = useState(
        {
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: "Estudiante",
            aprobationStatus: isRegistering ? "Pendiente" : "Aceptado",
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;
    // onSubmit handler
    const onSubmit = (userObject) => {
        const newUser = {
            name: userObject.fullName,
            username: userObject.username,
            email: userObject.email,
            password: userObject.password,
            role: userObject.role,
            aprobationStatus: userObject.aprobationStatus,
        };

        axios.post(
            apiUrl + '/users/create-user',
            newUser)
            .then((res) => {
                if (res.status === 201) {
                    alert('Usuario creado exitosamente')
                }
                else {
                    Promise.reject()
                }
            })
            .catch(err => alert('Algo ha salido mal'))
    }

    return (
        <UserForm
            initialValues={formValues}
            onSubmit={onSubmit}
            isRegistering={isRegistering}
        >
            {isRegistering ? "Registrarse" : "Crear Usuario"}
        </UserForm>
    )

}

export default CreateUser;