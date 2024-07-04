import React from "react";
import * as yup from "yup";
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import FormControl from '@mui/material/FormControl';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

import { useEffect } from "react";


const validationSchema = yup.object({
    experimentName: yup
        .string('Entra el nombre del experimento')
        .required("Requerido"),
    description: yup
        .string('Entra la descripción del experimento'),
    robotsQuantity: yup
        .number()
        .positive("Valor invalido")
        .integer("Valor invalido")
        .required("Requerido"),
});

const ExperimentForm = (props) => {
    const formik = useFormik({
        initialValues: props.initialValues,
        validationSchema: validationSchema,
        onSubmit: props.onSubmit,
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
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="select-cant-robots-label">Cant. Robots</InputLabel>
                            <Select
                                labelId="select-cant-robots-label"
                                id="select-cant-robots"
                                name="robotsQuantity"
                                value={formik.values.robotsQuantity || 1}
                                variant='filled'
                                label="Cant. Robots"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.robotsQuantity && Boolean(formik.errors.robotsQuantity)}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                            </Select>
                            <FormHelperText>Robots para experimento</FormHelperText>
                        </FormControl>

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