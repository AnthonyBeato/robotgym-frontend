import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import ExperimentForm from "./ExperimentForm"

const EditExperiment = () => {
    const [formValues, setFormValues] = useState(
        {
            experimentName: '',
            description: '',
            robotsQuantity: 1,
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_HOST;

    // onSubmit handler
    const onSubmit = (experimentObject) => {
        const updatedExperiment = {
            name: experimentObject.experimentName,
            description: experimentObject.description,
            robotsQuantity: experimentObject.robotsQuantity,
        }

        axios.put(
            apiUrl + '/experiments/update-experiment/' + id, updatedExperiment
        )
            .then((res) => {
                if (res.status === 200) {
                    alert('Experimento editado exitosamente');
                    navigate("/experiments");
                } else
                    Promise.reject()
            })
            .catch(err => alert('Algo ha salido mal'))
    }

    // Cargar data del server y reinicializar el form de student
    useEffect(() => {
        axios.get(
            apiUrl + '/experiments/' + id
        )
            .then((res) => {
                const {
                    name,
                    description,
                    robotsQuantity
                } = res.data;
                setFormValues(
                    {
                        experimentName: name,
                        description,
                        robotsQuantity
                    }
                );
            })
            .catch(err => console.log(err)
            );
    }, [apiUrl, id]);

    return (
        <ExperimentForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Editar Experimento
        </ExperimentForm>
    )

}

export default EditExperiment;