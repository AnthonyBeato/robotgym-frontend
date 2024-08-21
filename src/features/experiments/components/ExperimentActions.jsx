import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types'; // ES6


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ExperimentActions = ({ experimentId, experimentName, isActive, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    // Función para obtener el ID del usuario del token JWT
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token'); 
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
                    onDelete(experimentId);
                } else {
                    Promise.reject();
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    // Iniciar un experimento 
    const startExperiment = () => {
        axios.post(apiUrl + '/experiments/start-experiment/' + experimentId, {}, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                console.log(token);
                if (res.status === 200) {
                    // Iniciando experimento
                    // Redireccionar a la pantalla de experimento iniciado
                    navigate(`/experiments/${experimentId}/control`);
                } else {
                    Promise.reject();
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    //  Retomar un experimento no desactivado
    const retakeExperiment = () => {
        axios.post(apiUrl + '/experiments/' + experimentId + '/control', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
    }

    return (
        <div>
            {isActive ? (
                <Button
                 variant="contained"
                 color="primary"
                 style={{ marginLeft: '10px' }}
                 onClick={retakeExperiment}
                >
                    Retomar
                </Button>
            ) : (
                <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '10px' }}
                onClick={handleClickOpen}
                >
                    Iniciar
                </Button>
            )}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-start-experiment"
            >
                <DialogTitle>¿Está seguro que quiere iniciar <b>{experimentName}</b>?</DialogTitle>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' onClick={startExperiment}>Aceptar</Button>
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

ExperimentActions.propTypes = {
    experimentId: PropTypes.string.isRequired,
    experimentName: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default ExperimentActions;