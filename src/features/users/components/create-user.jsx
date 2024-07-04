import axios from "axios"
import { useState } from "react"

import UserForm from "./UserForm"

const CreateUser = () => {
    const [formValues, setFormValues] = useState(
        {
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: "Estudiante",
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
        >
            Crear Usuario
        </UserForm>
    )

}

export default CreateUser;