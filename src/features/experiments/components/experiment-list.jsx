import axiosInstance from '../../../instance/axiosIntance';
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import ExperimentActions from './ExperimentActions';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { jwtDecode } from 'jwt-decode';
import CustomAlert from "../../../components/CustomAlert";

const ExperimentList = () => {
    const [experiments, setExperiments] = useState([]);

    const apiUrl = import.meta.env.VITE_HOST;

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

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Cargar data del server 
    useEffect(() => {
        if (!userId) {
            setAlertMessage("No se ha encontrado el usuario autenticado");
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        const fetchExperiments = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                console.error('No se encontró el token JWT');
                return;
            }

            try {
                const { data } = await axiosInstance.get(apiUrl + '/experiments/user/' + userId, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                setExperiments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.log(error);
                setExperiments([]);
            }
        };

        fetchExperiments();
    }, [apiUrl, userId]);

    // Función para eliminar un experimento de la lista
    const removeExperimentFromList = (experimentId) => {
        setExperiments(experiments.filter(experiment => experiment._id !== experimentId));
    };    


    const rows = experiments.map((experiment) => ({
        id: experiment._id,
        name: experiment.name,
        description: experiment.description,
        status: experiment.isActive ? 'Activo' : 'Inactivo',
    }));

    
    const columns = [
        { field: 'name', headerName: 'Nombre', width: 200, 
            renderCell: (params) => (
                <Button 
                    component={Link}
                    to={`/experiments/${params.row.id}/control`}
                >{params.row.name}</Button>
        )},
        { field: 'description', headerName: 'Descripción', width: 400 },
        { field: 'status', headerName: 'Estado', width: 200 },
        {
            field: 'action',
            headerName: 'Acción',
            width: 300,
            renderCell: (params) => (
                <ExperimentActions
                    experimentId={params.row.id}
                    experimentName={params.row.name}
                    cantRobots={params.row.robotsQuantity}
                    isActive={params.row.isActive}
                    onDelete={removeExperimentFromList} 
                />
            )
        },
    ];

    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        
            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </>

            

    )

}

export default ExperimentList;