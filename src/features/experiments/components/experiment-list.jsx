import axios from "axios"
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import ExperimentActions from './ExperimentActions';


const columns = [
    { field: 'name', headerName: 'Nombre', width: 200 },
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
        width: 200,
        renderCell: (params) => (
            <ExperimentActions
                experimentId={params.row.id}
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
        axios.get(
            apiUrl + '/experiments/')
            .then(({ data }) => {
                setExperiments(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.log(err)
                setExperiments([]);
            });
    }, [apiUrl]);

    const rows = experiments.map((experiment, index) => ({
        id: experiment._id,
        name: experiment.name,
        description: experiment.description,
        robotsQuantity: experiment.robotsQuantity,
    }));

    return (
        <div style={{ height: 400, width: "100%" }}>
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
        </div>
    )

}

export default ExperimentList;