import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../instance/axiosIntance';
import PropTypes from 'prop-types'; // ES6
import { useState } from "react"

import CustomAlert from "../../../components/CustomAlert";

const RobotActions = ({ robotId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;


    const token = localStorage.getItem('token');

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Borrar un experimento
    const deleteRobot = () => {
        axiosInstance.delete(apiUrl + '/robots/delete-robot/' + robotId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Robot borrado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    onDelete(robotId);
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
                variant="outlined"
                color="info"
                style={{ marginLeft: '10px' }}
                component={Link}
                to={`/admin/robots/edit-robot/${robotId}`}
            >
                Editar
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={deleteRobot}
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

RobotActions.propTypes = {
    robotId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default RobotActions;