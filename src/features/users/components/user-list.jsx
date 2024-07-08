import axios from "axios"
import { useEffect, useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import UsersActions from "./UserActions";

const columns = [
    { field: 'name', headerName: 'Nombre Completo', width: 200 },
    { field: 'username', headerName: 'User', width: 200 },
    { field: 'role', headerName: 'Rol', width: 200 },
    { field: 'aprobationStatus', headerName: 'Estado', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
        field: 'action',
        headerName: 'Acción',
        width: 200,
        renderCell: (params) => (
            <UsersActions
                userId={params.row.id}
                onDelete={() => handleDelete(params.row.id)}
            />
        )
    },
];

const UserList = () => {
    const [users, setUsers] = useState([]);

    const apiUrl = import.meta.env.VITE_HOST;

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        axios.get(
            apiUrl + '/users/')
            .then(({ data }) => {
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.log(err)
                setUsers([]);
            });
    }, [apiUrl]);

    const rows = users.map((user, index) => ({
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        aprobationStatus: user.aprobationStatus,
        email: user.email,
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

export default UserList;