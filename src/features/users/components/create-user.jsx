import axiosInstance from '../../../instance/axiosIntance';
import { useState } from "react"

import UserForm from "./UserForm"
import PropTypes from 'prop-types'; // ES6


const CreateUser = (props) => {
    const isRegistering = props.isRegistering;

    const [formValues] = useState(
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
    const token = localStorage.getItem('token');

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

        axiosInstance.post(
            apiUrl + '/users/create-user',
            newUser, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    alert('Usuario creado exitosamente')
                }
                else {
                    Promise.reject()
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
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

CreateUser.propTypes = {
    isRegistering: PropTypes.bool.isRequired,
};


export default CreateUser;