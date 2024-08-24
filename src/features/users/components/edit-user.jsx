import axiosInstance from '../../../instance/axiosIntance';
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from "./UserForm"
import CustomAlert from "../../../components/CustomAlert";

const EditUser = () => {
    const [formValues, setFormValues] = useState(
        {
            fullName: '',
            username: '',
            email: '',
            role: "Estudiante",
            aprobationStatus: 'Pendiente',
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
    const onSubmit = (userObject) => {
        const updatedUser = {
            name: userObject.fullName,
            username: userObject.username,
            email: userObject.email,
            role: userObject.role,
            aprobationStatus: userObject.aprobationStatus,
        }

        axiosInstance.put(
            apiUrl + '/users/update-user/' + id, updatedUser, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Usuario editado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    setTimeout(() => {
                        navigate("/admin/users");
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
            apiUrl + '/users/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                const {
                    name,
                    username,
                    email,
                    password,
                    role,
                    aprobationStatus,
                } = res.data;
                setFormValues(
                    {
                        fullName: name,
                        username,
                        email,
                        password,
                        role,
                        aprobationStatus,
                    }
                );
            })
            .catch(err => console.log(err)
            );
    }, [apiUrl, id, token]);


    return (
        <>        
            <UserForm
                initialValues={formValues}
                onSubmit={onSubmit}
            >
                Editar Usuario
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

export default EditUser;