import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../instance/axiosIntance';
import PropTypes from 'prop-types'; // ES6

const UsersActions = ({ userId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;


    const token = localStorage.getItem('token');

    const deleteUser = () => {
        axiosInstance.delete(apiUrl + '/users/delete-user/' + userId, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    alert("Usuario borrado satisfactoriamente");
                    onDelete(userId);
                } else {
                    Promise.reject();
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
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

UsersActions.propTypes = {
    userId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default UsersActions;
