import axios from "axios"
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import ExperimentActions from './ExperimentActions';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { jwtDecode } from 'jwt-decode';


const columns = [
    { field: 'name', headerName: 'Nombre', width: 200, 
        renderCell: (params) => (
            <Button 
                component={Link}
                to={`/experiments/${params.row.id}/manual-control`}
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
                onDelete={() => handleDelete(params.row.id)}
                isActive={params.row.isActive}
            />
        )
    },
];

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

    if (!userId) {
        alert('No se ha encontrado el usuario autenticado');
        return;
    }

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        const fetchExperiments = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                console.error('No se encontró el token JWT');
                return;
            }

            try {
                const { data } = await axios.get(apiUrl + '/experiments/user/' + userId, {
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
    }, [apiUrl]);

    const rows = experiments.map((experiment, index) => ({
        id: experiment._id,
        name: experiment.name,
        description: experiment.description,
        status: experiment.isActive ? 'Activo' : 'Inactivo',
    }));

    return (
        
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

    )

}

export default ExperimentList;