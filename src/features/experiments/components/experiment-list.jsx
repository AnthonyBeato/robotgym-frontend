import axios from "axios"
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import ExperimentActions from './ExperimentActions';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';


const columns = [
    { field: 'name', headerName: 'Nombre', width: 200, 
        renderCell: (params) => (
            <Button 
                component={Link}
                to={`/experiments/${params.row.id}`}
            >{params.row.name}</Button>
    )},
    { field: 'description', headerName: 'Descripción', width: 400 },
    {
        field: 'robotsQuantity',
        headerName: 'Cant. Robots',
        type: 'number',
        width: 90,
    },
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
            />
        )
    },
];

const ExperimentList = () => {
    const [experiments, setExperiments] = useState([]);

    const apiUrl = import.meta.env.VITE_HOST;

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        const fetchExperiments = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                console.error('No se encontró el token JWT');
                return;
            }

            try {
                const { data } = await axios.get(apiUrl + '/experiments/', {
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
        robotsQuantity: experiment.robotsQuantity,
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