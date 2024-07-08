import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from "./UserForm"

const EditUser = () => {
    const [formValues, setFormValues] = useState(
        {
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: "Estudiante",
            aprobationStatus: 'Pendiente',
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_HOST;

    // onSubmit handler
    const onSubmit = (userObject) => {
        const updatedUser = {
            name: userObject.fullName,
            username: userObject.username,
            email: userObject.email,
            password: userObject.password,
            role: userObject.role,
            aprobationStatus: userObject.aprobationStatus,
        }

        axios.put(
            apiUrl + '/users/update-user/' + id, updatedUser
        )
            .then((res) => {
                if (res.status === 200) {
                    alert('Usuario editado exitosamente');
                    navigate("/users");
                } else
                    Promise.reject()
            })
            .catch(err => alert('Algo ha salido mal'))
    }

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        axios.get(
            apiUrl + '/users/' + id
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
    }, [apiUrl, id]);

    return (
        <UserForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Editar Usuario
        </UserForm>
    )

}

export default EditUser;