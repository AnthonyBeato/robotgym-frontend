import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const getAvailableRobots = async () => {
    const apiUrl = import.meta.env.VITE_HOST;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(apiUrl + '/robots', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching robots:', error);
        return [];
    }
};
const ExperimentActions = ({ experimentId, experimentName, onDelete, isActive }) => {
    const apiUrl = import.meta.env.VITE_HOST;
    const navigate = useNavigate();

    const [availableRobots, setAvailableRobots] = useState([]);
    const [robotsQuantity, setRobotsQuantity] = useState(1);
    const [robotsOptions, setRobotsOptions] = useState([]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const fetchRobots = async () => {
            const robots = await getAvailableRobots();
            setAvailableRobots(robots);
            const options = Array.from({ length: robots.length }, (_, i) => i + 1);
            setRobotsOptions(options);
            if (options.length > 0) {
                setRobotsQuantity(options[0]);
            }
        };
        fetchRobots();
    }, []);

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
                    onDelete();
                } else {
                    Promise.reject();
                }
            })
            .catch((err) => alert("Algo ha salido mal"));
    }

    // Iniciar un experimento 
    const startExperiment = () => {
        axios.post(apiUrl + '/experiments/start-experiment/' + experimentId, { robotsQuantity }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    // Iniciando experimento
                    // Redireccionar a la pantalla de experimento iniciado
                    navigate(`/experiments/${experimentId}/manual-control`, {state: {robotsQuantity} });
                } else {
                    Promise.reject();
                }
            })
            .catch((err) => alert("Algo ha salido mal"));
    }

    //  Retomar un experimento no desactivado
    const retakeExperiment = () => {
        axios.post(apiUrl + '/experiments/start-experiment/' + experimentId, { robotsQuantity }, {
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
                <DialogTitle>Iniciando proyecto: <b>{experimentName}</b></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-start-experiment" >
                        Selecciona la cantidad de robots que deseas usar:
                    </DialogContentText>
                    <Box mt={2}>
                    {robotsOptions.length > 0 ? (
                        <FormControl fullWidth>
                            <InputLabel id="select-robots-quantity-label"></InputLabel>
                            <Select
                                labelId="select-robots-quantity-label"
                                id="select-robots-quantity"
                                value={robotsQuantity}
                                onChange={(e) => setRobotsQuantity(e.target.value)}
                            >
                                {robotsOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Robots disponibles para el experimento</FormHelperText>
                        </FormControl>
                    ) : (
                        <DialogContentText>No hay robots disponibles en este momento.</DialogContentText>
                    )}
                    </Box>
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