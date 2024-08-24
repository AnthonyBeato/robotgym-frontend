import { useContext } from "react";
import * as yup from "yup";
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import axiosInstance from '../../../instance/axiosIntance';

import { useNavigate } from "react-router-dom"

import { AuthContext } from "../../../context/AuthContext";
import {useState } from "react"
import CustomAlert from "../../../components/CustomAlert";

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

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const apiUrl = import.meta.env.VITE_HOST;
    // onSubmit handler
    const onSubmit = (userObject) => {
        const user = {
            username: userObject.username,
            password: userObject.password,
        };

        axiosInstance.post( apiUrl + '/users/login', user)
            .then((res) => {
                if (res.status === 200) {
                    setAlertMessage('Usuario logueado exitosamente');
                    setAlertSeverity('success');
                    setAlertOpen(true);

                    setToken(res.data.accessToken);
                    localStorage.setItem("token", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken); 

                    setTimeout(() => {
                        navigate("/experiments");
                    }, 1500);
                } else {
                    setToken(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    
                    setAlertMessage('Algo ha salido mal. Inténtalo de nuevo.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            })
            .catch((error) => {
                setAlertMessage("Algo ha salido mal: " + error.message);
                setAlertSeverity('error');
                setAlertOpen(true);
            });
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

            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </div>
    )
}

export default Login;