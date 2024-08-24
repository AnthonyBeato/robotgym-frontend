import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../instance/axiosIntance';
import PropTypes from 'prop-types'; // ES6


const RobotActions = ({ robotId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;


    const token = localStorage.getItem('token');

    // Borrar un experimento
    const deleteRobot = () => {
        axiosInstance.delete(apiUrl + '/robots/delete-robot/' + robotId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    alert("Robot borrado satisfactoriamente");
                    onDelete(robotId);
                } else {
                    Promise.reject();
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    return (
        <div>
            <Button
                variant="outlined"
                color="info"
                style={{ marginLeft: '10px' }}
                component={Link}
                to={`/robots/edit-robot/${robotId}`}
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
        </div>
    );
}

RobotActions.propTypes = {
    robotId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default RobotActions;