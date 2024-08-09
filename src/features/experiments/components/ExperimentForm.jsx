import * as yup from "yup";
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { useEffect, useRef } from "react";
import PropTypes from 'prop-types'; // ES6


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

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            formik.setValues(props.initialValues);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

ExperimentForm.propTypes = {
    initialValues: PropTypes.shape({
        experimentName: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};


export default ExperimentForm;