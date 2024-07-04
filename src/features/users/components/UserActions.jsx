import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';

const ExperimentActions = ({ experimentId, onDelete }) => {
    const apiUrl = import.meta.env.VITE_HOST;

    const deleteExperiment = () => {
        axios.delete(apiUrl + '/experiments/delete-experiment/' + experimentId)
            .then((res) => {
                if (res.status === 200) {
                    alert("Experimento borrado satisfactoriamente");
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
                to={`/experiments/edit-experiment/${experimentId}`}
            >
                Editar
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={deleteExperiment}
                style={{ marginLeft: '10px' }}
            >
                Eliminar
            </Button>
        </div>
    );
}

export default ExperimentActions;