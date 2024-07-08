import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';

const UsersActions = ({ userId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;

    const deleteUser = () => {
        axios.delete(apiUrl + '/users/delete-user/' + userId)
            .then((res) => {
                if (res.status === 200) {
                    alert("Usuario borrado satisfactoriamente");
                    onDelete();
                } else {
                    Promise.reject();
                }
            })
            .catch((err) => alert("Algo ha salido mal"));
    }

    return (
        <div>
            <Button
                variant="contained"
                color="info"
                style={{ marginLeft: '10px' }}
                component={Link}
                to={`/admin/users/edit-user/${userId}`}
            >
                Editar
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={deleteUser}
                style={{ marginLeft: '10px' }}
            >
                Eliminar
            </Button>
        </div>
    );
}

export default UsersActions;