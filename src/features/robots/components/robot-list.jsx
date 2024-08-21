import axios from "axios"
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import RobotActions from './RobotActions';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';



const RobotList = () => {
    const [robots, setRobots] = useState([]);

    const apiUrl = import.meta.env.VITE_HOST;

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        const fetchRobots = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                console.error('No se encontró el token JWT');
                return;
            }

            try {
                const { data } = await axios.get(apiUrl + '/robots/', {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                setRobots(Array.isArray(data) ? data : []);
            } catch (error) {
                console.log(error);
                setRobots([]);
            }
        };

        fetchRobots();
    }, [apiUrl]);

    // Función para eliminar un experimento de la lista
    const removeRobotFromList = (robotId) => {
        setRobots(robots.filter(robot => robot._id !== robotId));
    };        
    
    const rows = robots.map((robot) => ({
        id: robot._id,
        model: robot.model,
        statusUse: robot.statusUse,
        ip: robot.ip,
        hostname: robot.hostname,
    }));

    const columns = [
        { field: 'model', headerName: 'Modelo', width: 200, 
            renderCell: (params) => (
                <Button 
                    component={Link}
                    to={`/robots/${params.row.id}`}
                >{params.row.model}</Button>
        )},
        { field: 'statusUse', headerName: 'Estado', width: 200 },
        { field: 'ip', headerName: 'Dirección IP', width: 200},
        { field: 'hostname', headerName: 'Nombre de Host', width: 200},
        {
            field: 'action',
            headerName: 'Acción',
            width: 200,
            renderCell: (params) => (
                <RobotActions
                    robotId={params.row.id}
                    onDelete={removeRobotFromList} 
                />
            )
        },
    ];

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

export default RobotList;