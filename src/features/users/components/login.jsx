import { useContext } from "react";
import * as yup from "yup";
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import axios from "axios"
import {useState } from "react"

import { useNavigate } from "react-router-dom"

import { AuthContext } from "../../../context/AuthContext";

const validationSchema = yup.object({
    username: yup
        .string('Entra el username')
        .required("Requerido"),
    password: yup
        .string('Entra la contraseña')
        .required("Requerido"),
});

const Login = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [initialLoginValues] = useState(
        {
            username: '',
            password: '',
        }
    )

    const apiUrl = import.meta.env.VITE_HOST;
    // onSubmit handler
    const onSubmit = (userObject) => {
        const user = {
            username: userObject.username,
            password: userObject.password,
        };

        axios.post( apiUrl + '/users/login', user)
            .then((res) => {
                if (res.status === 200) {
                    alert('Usuario logueado exitosamente');
                    setToken(res.data.token);
                    localStorage.setItem("token", res.data.token);
                    navigate("/experiments");
                }
                else {
                    Promise.reject()
                    setToken(null);
                    localStorage.removeItem("token");
                }
            })
            .catch((error) => alert("Algo ha salido mal: " + error.message));
    }

    const formik = useFormik({
        initialValues: initialLoginValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit,
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} >
                    <Grid xs={12}>
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
                    <Grid xs={12}>
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

                    <Grid xs={12}>
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Iniciar Sesión
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default Login;