import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import axiosInstance from '../../instance/axiosIntance';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types'; // ES6

const QueuePositionModal = ({ open, onClose, experimentId }) => {
    const [position, setPosition] = useState(null);
    const [nextUser, setNextUser] = useState('');
    const apiUrl = import.meta.env.VITE_HOST;
    
    useEffect(() => {
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
        if (open) {
            // Llamada a la API para obtener la posición en la cola
            const fetchQueuePosition = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axiosInstance.get(`${apiUrl}/queue/first`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const firstExperiment = response.data;
                    // Aquí deberías implementar la lógica para calcular la posición en la cola y el próximo usuario.
                    // Por ejemplo:
                    setPosition(firstExperiment._id === experimentId ? 1 : '...');
                    setNextUser(firstExperiment.user.name);
                } catch (error) {
                    console.error("Error al obtener la posición en la cola", error);
                }
            };

            fetchQueuePosition();
        }
    }, [open, experimentId, apiUrl]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tu posición en la cola</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Posición actual: {position}</Typography>
                <Typography variant="subtitle1">Próximo en la cola: {nextUser}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};


QueuePositionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    experimentId: PropTypes.string.isRequired,
}

export default QueuePositionModal;
