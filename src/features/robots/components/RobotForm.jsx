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

import { useEffect, useRef } from "react";
import PropTypes from 'prop-types'; // ES6


const validationSchema = yup.object({
    model: yup
        .string('Entra el nombre del modelo de robot')
        .required("Requerido"),
    statusUse: yup
        .string('Entra la descripción del experimento')
        .required("Requerido"),
});

const RobotForm = (props) => {

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
                            id="txt-robot-model"
                            name="model"
                            placeholder='Modelo'
                            aria-label='Modelo del robot'
                            value={formik.values.model}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.model && Boolean(formik.errors.model)}
                            helperText={formik.touched.model && formik.errors.model}
                            fullWidth
                            size='small'
                            required
                            variant="filled"
                        />
                    </Grid>
                    <Grid xs={3}>
                        <FormControl>
                            <InputLabel id="select-status-robot-label">Rol</InputLabel>
                            <Select
                                labelId="select-status-robot-labell"
                                id="select-status-robot"
                                name="statusUse"
                                value={formik.values.statusUse}
                                variant='filled'
                                label="Estado"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.statusUse && Boolean(formik.errors.statusUse)}
                            >
                                <MenuItem value={"Disponible"}>Disponible</MenuItem>
                                <MenuItem value={"En Uso"}>En Uso</MenuItem>
                                <MenuItem value={"Mantenimiento"}>Mantenimiento</MenuItem>
                            </Select>
                            <FormHelperText>Estado del Robot</FormHelperText>
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

RobotForm.propTypes = {
    initialValues: PropTypes.shape({
        model: PropTypes.string.isRequired,
        statusUse: PropTypes.string.isRequired,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};


export default RobotForm;