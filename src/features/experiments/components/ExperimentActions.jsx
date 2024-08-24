import { Link, useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../instance/axiosIntance';
import { jwtDecode } from 'jwt-decode';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types'; // ES6
import QueuePositionModal from '../../queue/QueuePositionModal';
import CustomAlert from "../../../components/CustomAlert";
import { useState } from "react"


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ExperimentActions = ({ experimentId, experimentName, isActive, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;
    const navigate = useNavigate();

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openQueueModal, setOpenQueueModal] = React.useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');


    const handleClickOpenConfirm = () => {
      setOpenConfirm(true);
    };
  
    const handleCloseConfirm = () => {
      setOpenConfirm(false);
    };

    const handleOpenQueueModal = () => {
        setOpenQueueModal(true);
        handleCloseConfirm();
    };

    const handleCloseQueueModal = () => {
        setOpenQueueModal(false);
    };
    
    const token = localStorage.getItem('token'); 

    // Función para obtener el ID del usuario del token JWT
    const getUserIdFromToken = () => {
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        }
        return null;
    }

    const userId = getUserIdFromToken();

    if (!userId) {
        setAlertMessage("No se ha encontrado el usuario autenticado");
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
    }

    // Función intermedia para agregar el experimento a la cola y verificar su posición
    const addToQueueAndStart = () => {
        axiosInstance.post(`${apiUrl}/queue/add`, { experimentId }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.status === 200) {
                // Abrir modal de cola para mostrar la posición
                handleOpenQueueModal();
                // Aquí puedes agregar lógica adicional para verificar si es el turno del usuario
                // Si es su turno, se llama a startExperiment
                checkQueuePositionAndStartExperiment();
            } else {
                Promise.reject();
            }
        })
        .catch((error) => {
            setAlertMessage("Algo ha salido mal: " + error.message);
            setAlertSeverity('error');
            setAlertOpen(true);
        });
    };

    // Verifica la posición en la cola y, si es el turno del usuario, inicia el experimento
    const checkQueuePositionAndStartExperiment = () => {
        const fetchQueuePosition = async () => {
            try {
                const response = await axiosInstance.get(`${apiUrl}/queue/first`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const firstExperiment = response.data;
                if (firstExperiment._id === experimentId) {
                    startExperiment(); // Llama a startExperiment cuando sea el turno del usuario
                }
            } catch (error) {
                console.error("Error al obtener la posición en la cola", error);
            }
        };

        fetchQueuePosition();
    };


    // Iniciar un experimento 
    const startExperiment = () => {
        axiosInstance.post(apiUrl + '/experiments/start-experiment/' + experimentId, {}, {
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
            .catch((error) => {
                setAlertMessage("Algo ha salido mal: " + error.message);
                setAlertSeverity('error');
                setAlertOpen(true);
            });
    }

    // Borrar un experimento
    const deleteExperiment = () => {
        axiosInstance.delete(apiUrl + '/experiments/delete-experiment/' + experimentId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Experimento borrado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    onDelete(experimentId);
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


    //  Retomar un experimento no desactivado
    const retakeExperiment = () => {
        axiosInstance.post(apiUrl + '/experiments/' + experimentId + '/control', {
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
                onClick={handleClickOpenConfirm}
                >
                    Iniciar
                </Button>
            )}
            <Dialog
                open={openConfirm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseConfirm}
                aria-describedby="alert-dialog-start-experiment"
            >
                <DialogTitle>¿Está seguro que quiere iniciar <b>{experimentName}</b>?</DialogTitle>
                <DialogActions>
                    <Button variant='outlined' onClick={handleCloseConfirm}>Cancelar</Button>
                    <Button variant='contained' onClick={addToQueueAndStart}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            <QueuePositionModal
                open={openQueueModal}
                onClose={handleCloseQueueModal}
                experimentId={experimentId}
            />
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
            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
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