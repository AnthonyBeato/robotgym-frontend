import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';

import * as React from 'react';

const RobotActions = ({ robotId , onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const token = localStorage.getItem('token');

    // Borrar un experimento
    const deleteRobot = () => {
        axios.delete(apiUrl + '/robots/delete-robot/' + robotId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    alert("Robot borrado satisfactoriamente");
                    onDelete();
                } else {
                    Promise.reject();
                }
            })
            .catch((err) => alert("Algo ha salido mal"));
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

export default RobotActions;