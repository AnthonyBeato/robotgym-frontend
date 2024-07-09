import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

const ExperimentActions = ({ experimentId, experimentName, cantRobots, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    // Función para obtener el ID del usuario del token JWT
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token'); // Asumiendo que guardaste el token en el localStorage
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        }
        return null;
    }

    const userId = getUserIdFromToken();

    if (!userId) {
        alert('No se ha encontrado el usuario autenticado');
        return;
    }

    const token = localStorage.getItem('token');

    // Borrar un experimento
    const deleteExperiment = () => {
        axios.delete(apiUrl + '/experiments/delete-experiment/' + experimentId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    alert("Experimento borrado satisfactoriamente");
                    onDelete();
                } else {
                    Promise.reject();
                }
            })
            .catch((err) => alert("Algo ha salido mal"));
    }

    // Iniciar un experimento 
    const startExperiment = () => {
        axios.post(apiUrl + '/experiments/start-experiment/' + experimentId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    // Iniciando experimento
                    // Redireccionar a la pantalla de experimento iniciado
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
                onClick={handleClickOpen}
            >
                Iniciar
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-start-experiment"
            >
                <DialogTitle>¿Estas seguro de iniciar el proyecto: <b>{experimentName}</b> ?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-start-experiment">
                        Su experimento usará {cantRobots} robots
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' onClick={startExperiment}>Iniciar</Button>
                </DialogActions>
            </Dialog>
            <Button
                variant="outlined"
                color="info"
                style={{ marginLeft: '10px' }}
                component={Link}
                to={`/experiments/edit-experiment/${experimentId}`}
            >
                Editar
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={deleteExperiment}
                style={{ marginLeft: '10px' }}
            >
                Eliminar
            </Button>
        </div>
    );
}

export default ExperimentActions;