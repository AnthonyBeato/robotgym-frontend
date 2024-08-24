import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../instance/axiosIntance';
import PropTypes from 'prop-types'; // ES6
import CustomAlert from "../../../components/CustomAlert";
import { useState } from "react"

const UsersActions = ({ userId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;


    const token = localStorage.getItem('token');

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const deleteUser = () => {
        axiosInstance.delete(apiUrl + '/users/delete-user/' + userId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Usuario borrado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    onDelete(userId);
                } else {
                    Promise.reject();
                }
            })
            .catch((error) => {
                setAlertMessage("Algo ha salido mal: " + error.message);
                setAlertSeverity('error');
                setAlertOpen(true);
            });
    }

    return (
        <div>
            <Button
                variant="contained"
                color="info"
                style={{ marginLeft: '10px' }}
                component={Link}
                to={`/admin/users/edit-user/${userId}`}
            >
                Editar
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={deleteUser}
                style={{ marginLeft: '10px' }}
            >
                Eliminar
            </Button>

            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </div>
    );
}

UsersActions.propTypes = {
    userId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default UsersActions;
