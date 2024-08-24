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

import { useEffect, useRef} from "react";
import PropTypes from 'prop-types'; // ES6


const UserForm = (props) => {
    const validationSchema = yup.object({
        fullName: yup
            .string('Entra el nombre completo')
            .required("Requerido"),
        username: yup
            .string('Entra el username')
            .required("Requerido"),
        email: yup
            .string('Entra el email')
            .required("Requerido"),
        password: props.isRegistering ? yup
            .string('Entra la contraseña')
            .required("Requerido")
            : yup.string('Entra la contraseña'),
        confirmPassword: props.isRegistering ? yup
            .string('Confirma la contraseña')
            .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
            .required("Requerido")
            : yup.string('Confirma la contraseña'),
        role: yup
            .string('Entra el rol')
            .required("Requerido"),
        aprobationStatus: yup
            .string('Entra el status de aprobación')
            .required("Requerido"),
    });

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
        }        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialValues]);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} >
                    <Grid xs={12}>
                        <TextField
                            id="txt-full-name"
                            name="fullName"
                            placeholder='Nombre completo'
                            aria-label='Nombre completo del usuario'
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                            fullWidth
                            size='small'
                            required
                            variant="filled"
                        />
                    </Grid>
                    <Grid xs={6}>
                        <TextField
                            id="txt-user-name"
                            name="username"
                            placeholder='Nombre de usuario'
                            aria-label='Nombre de usuario'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            fullWidth
                            size='small'
                            required
                            variant="filled"
                        />
                    </Grid>
                    <Grid xs={6}>
                        <TextField
                            id="txt-user-email"
                            name="email"
                            placeholder='Email de usuario'
                            aria-label='Email de usuario'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            fullWidth
                            type="email"
                            size='small'
                            required
                            variant="filled"
                        />
                    </Grid>
                    {(props.isRegistering || props.isEditing) || (!props.isRegistering) && (
                        <>
                            <Grid xs={6}>
                                <TextField
                                    id="txt-user-password"
                                    name="password"
                                    placeholder='Contraseña'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    fullWidth
                                    type="password"
                                    size='small'
                                    variant="filled"
                                />
                            </Grid>
                            {props.isRegistering && (
                                <Grid xs={6}>
                                    <TextField
                                        id="txt-confirm-password"
                                        name="confirmPassword"
                                        placeholder='Confirma la contraseña'
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                        fullWidth
                                        type="password"
                                        size='small'
                                        variant="filled"
                                    />
                                </Grid>
                            )}
                        </>
                    )}
                    <Grid xs={3}>
                        <FormControl>
                            <InputLabel id="select-role-label">Rol</InputLabel>
                            <Select
                                labelId="select-role-label"
                                id="select-role"
                                name="role"
                                value={formik.values.role}
                                variant='filled'
                                label="Rol"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.role && Boolean(formik.errors.role)}
                            >
                                <MenuItem value={"Estudiante"}>Estudiante</MenuItem>
                                <MenuItem value={"Profesor"}>Profesor</MenuItem>
                                <MenuItem value={"Administrador"}>Administrador</MenuItem>
                            </Select>
                            <FormHelperText>Rol de Usuario</FormHelperText>
                        </FormControl>

                    </Grid>

                    {!props.isRegistering && (
                        <Grid xs={3} >
                        <FormControl>
                            <InputLabel id="select-status-label">Status</InputLabel>
                            <Select
                                labelId="select-status-label"
                                id="select-status"
                                name="aprobationStatus"
                                value={formik.values.aprobationStatus}
                                variant='filled'
                                label="Status"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.aprobationStatus && Boolean(formik.errors.aprobationStatus)}
                            >
                                <MenuItem value={"Aceptado"}>Aceptado</MenuItem>
                                <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
                                <MenuItem value={"Rechazado"}>Rechazado</MenuItem>
                            </Select>
                            <FormHelperText>Status de aprobación del Usuario</FormHelperText>
                        </FormControl>

                    </Grid>
                    )}
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


UserForm.propTypes = {
    initialValues: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        aprobationStatus: PropTypes.string.isRequired
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    isRegistering: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool,
};

export default UserForm;