import axiosInstance from '../../../instance/axiosIntance';
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import UserForm from "./UserForm"
import PropTypes from 'prop-types'; // ES6

import CustomAlert from "../../../components/CustomAlert";

const CreateUser = (props) => {
    const isRegistering = props.isRegistering;    
    const navigate = useNavigate();


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

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

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

        if(isRegistering){
            axiosInstance.post(
                apiUrl + '/users/register', newUser)
                .then((res) => {
                    if (res.status === 201) {
                        setAlertMessage('Usuario registrado exitosamente');
                        setAlertSeverity('success');
                        setAlertOpen(true);
                        navigate("/users/login");
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
        } else {
            axiosInstance.post(
                apiUrl + '/users/create-user',
                newUser, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                })
                .then((res) => {
                    if (res.status === 201) {
                        setAlertMessage('Usuario creado exitosamente');
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

    }

    return (
        <>
            <UserForm
                initialValues={formValues}
                onSubmit={onSubmit}
                isRegistering={isRegistering}
            >
                {isRegistering ? "Registrarse" : "Crear Usuario"}
            </UserForm>

            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </>
    )

}

CreateUser.propTypes = {
    isRegistering: PropTypes.bool.isRequired,
};


export default CreateUser;