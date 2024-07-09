import React from "react";
import * as yup from "yup";
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { useEffect } from "react";

import axios from 'axios';

const getAvailableRobots = async () => {
    const apiUrl = import.meta.env.VITE_HOST;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(apiUrl + '/robots', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching robots:', error);
        return [];
    }
};

const validationSchema = yup.object({
    experimentName: yup
        .string('Entra el nombre del experimento')
        .required("Requerido"),
    description: yup
        .string('Entra la descripción del experimento'),
});

const ExperimentForm = (props) => {
    const formik = useFormik({
        initialValues: props.initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            props.onSubmit(values);
            resetForm();
        },
    });

    useEffect(() => {
        formik.setValues(props.initialValues);
    }, [props.initialValues]);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} >
                    <Grid xs={12}>
                        <TextField
                            id="experiment-name"
                            name="experimentName"
                            placeholder='Nombre'
                            aria-label='Nombre del experimento'
                            value={formik.values.experimentName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.experimentName && Boolean(formik.errors.experimentName)}
                            helperText={formik.touched.experimentName && formik.errors.experimentName}
                            fullWidth
                            size='small'
                            required
                            variant="filled"
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            id="txt-experiment-description"
                            name="description"
                            placeholder='Descripción'
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            fullWidth
                            multiline
                            rows={6}
                            size='small'
                            variant="filled"
                        />
                    </Grid>
                    <Grid xs={12}>
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            {props.children}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default ExperimentForm;