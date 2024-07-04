import axios from "axios"
import { useState } from "react"

import ExperimentForm from "./ExperimentForm"

const CreateExperiment = () => {
    const [formValues, setFormValues] = useState(
        {
            experimentName: '',
            description: '',
            cantRobots: 1,
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;
    // onSubmit handler
    const onSubmit = (experimentObject) => {
        const newExperiment = {
            name: experimentObject.experimentName,
            description: experimentObject.description,
            robotsQuantity: experimentObject.robotsQuantity,
            isActive: false,
            user: "662671dd8879b712ea44ada2"
        };

        axios.post(
            apiUrl + '/experiments/create-experiment',
            newExperiment)
            .then((res) => {
                if (res.status === 201) {
                    alert('Experimento creado exitosamente')
                }
                else {
                    Promise.reject()
                }
            })
            .catch(err => alert('Algo ha salido mal'))
    }

    return (
        <ExperimentForm
            initialValues={formValues}
            onSubmit={onSubmit}
        >
            Crear Experimento
        </ExperimentForm>
    )

}

export default CreateExperiment;