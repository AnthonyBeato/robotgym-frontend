import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import ExperimentPageStructure from '../components/ExperimentPageStructure';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ROSLIB from 'roslib';
import { CameraAlt, FiberManualRecord } from '@mui/icons-material';

const BumperIndicator = ({ bumper, active }) => {
    const color = active ? 'red' : 'grey';
    return (
        <Box
            sx={{
                width: 50,
                height: 50,
                backgroundColor: color,
                borderRadius: '50%',
                display: 'inline-block',
                margin: 1,
            }}
        ></Box>
    );
};

function ExperimentManualControlPage() {
    const { token, loading } = useContext(AuthContext);
    const [connected, setConnected] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { id: experimentId } = useParams();
    const { robotsQuantity } = location.state || {};
    const [robotNumber, setRobotNumber] = useState('');
    const [speed, setSpeed] = useState(1000);  // Initial speed set to 1000
    const [bumpers, setBumpers] = useState([false, false, false, false, false, false]);  // Initial bumper states
    const [isReconnecting, setIsReconnecting] = useState(false);
    const reconnectAttemptsRef = useRef(0);  // Keep track of reconnect attempts
    const rosRef = useRef(null);  // Use useRef to keep track of the ros instance
    const bumperListenerRef = useRef(null);  // Use useRef to keep track of the bumper listener
    const reconnectTimeoutRef = useRef(null);  // To store timeout ID

    const handleChange = (event) => {
        setRobotNumber(event.target.value);
    };

    const handleSpeedChange = (event, newValue) => {
        setSpeed(newValue * 100);  // Adjust according to your scale (0 to 10000)
    };

    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
        if (reconnectAttemptsRef.current > maxReconnectAttempts) {
            console.error('Failed to connect to websocket server after maximum attempts');
            setIsReconnecting(false);
            return;
        }

        if (rosRef.current) {
            rosRef.current.close();
        }

        const ros = new ROSLIB.Ros({
            url: 'ws://localhost:9090',
        });

        ros.on('connection', () => {
            console.log('Connected to websocket server.');
            setConnected(true);
            setIsReconnecting(false);
            reconnectAttemptsRef.current = 0;  // Reset reconnect attempts on successful connection
        
            // Suscribir al tópico de estado de bumpers
            if (bumperListenerRef.current) {
                bumperListenerRef.current.unsubscribe();
            }
        
            const bumperListener = new ROSLIB.Topic({
                ros: ros,
                name: '/bumpers_status',
                messageType: 'std_msgs/String',
            });
        
            bumperListener.subscribe((message) => {
                console.log('Received bumper status: ', message.data);
                const bumperData = parseInt(message.data.split(':')[1], 16);
                const bumperStates = [
                    (bumperData & 0x01) !== 0,
                    (bumperData & 0x02) !== 0,
                    (bumperData & 0x04) !== 0,
                    (bumperData & 0x08) !== 0,
                    (bumperData & 0x10) !== 0,
                    (bumperData & 0x20) !== 0,
                ];
                setBumpers(bumperStates);
            });
        
            bumperListenerRef.current = bumperListener;  // Guarda la referencia del listener de bumpers
        });
        
        ros.on('error', (error) => {
            console.log('Error connecting to websocket server: ', error);
            setConnected(false);
            if (!isReconnecting) {
                reconnectAttemptsRef.current++;
                setIsReconnecting(true);
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);  // Aumenta el tiempo de reconexión a 5 segundos
            }
        });
        
        ros.on('close', () => {
            console.log('Connection to websocket server closed.');
            setConnected(false);
            if (!isReconnecting) {
                reconnectAttemptsRef.current++;
                setIsReconnecting(true);
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);  // Aumenta el tiempo de reconexión a 5 segundos
            }
        });
        rosRef.current = ros;  // Save the ros reference
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (rosRef.current) {
                rosRef.current.close();
            }
            if (bumperListenerRef.current) {
                bumperListenerRef.current.unsubscribe();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const publisher = new ROSLIB.Topic({
        ros: rosRef.current,
        name: '/motor_commands',
        messageType: 'std_msgs/String',
    });

    const sendCommand = (command) => {
        if (connected) {
            const message = new ROSLIB.Message({
                data: `${command}${speed}`,
            });
            publisher.publish(message);
        } else {
            console.log('Not connected to websocket server.');
        }
    };

    const stopExperiment = () => {
        const apiUrl = import.meta.env.VITE_HOST;
        axios.post(`${apiUrl}/experiments/stop-experiment/${experimentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.status === 200) {
                alert('Experimento detenido satisfactoriamente');
                navigate('/experiments');
            } else {
                Promise.reject();
            }
        })
        .catch((err) => alert('Algo ha salido mal al detener el experimento'));
    };

    const takePhoto = () => {
        const cameraUrl = import.meta.env.VITE_CAMERA_HOST; // URL de tu Raspberry Pi
        window.location.href = `${cameraUrl}/capture_photo`; // Redirigir al endpoint para tomar la foto
    };

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/users/login" replace />;
    }

    return (
        <>
            <ExperimentPageStructure>
                <Grid container spacing={2}>
                    <Grid md={12}>
                        <h1>Control Manual</h1>
                    </Grid>
                    <Grid md={8}>
                        <Box
                            width={740}
                            height={460}
                            border={2}
                            borderRadius={2}
                        >
                           <img src="http://rpicamera1:5000/video_feed" alt="Video Stream Camera 1" 
                            style={{ width: '100%', height: '100%', borderRadius: 25, padding: 10}}
                           />
                        </Box>
                        <Grid container spacing={2} style={{marginTop: 10}} >
                            <Grid>
                                <Button variant="outlined" color='primary' onClick={takePhoto}>
                                    <CameraAlt style={{paddingRight: 2}}/> Tomar Foto
                                </Button>
                            </Grid>
                            <Grid>    
                                <Button variant="outlined" color='primary' >
                                   <FiberManualRecord style={{paddingRight: 2}}/> Grabar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid md={4}>
                        <Stack
                            spacing={4}
                            useFlexGap
                            // border={1}
                            sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-robot-number-select-label">Seleccionar Robot</InputLabel>
                                <Select
                                    labelId="demo-robot-number-select-label"
                                    id="demo-robot-numberselect"
                                    value={robotNumber}
                                    label="RobotNumber"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                </Select>
                            </FormControl>
                           
                            <Grid container spacing={1} sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Grid xs={12}>
                                    <span>Velocidad de movimiento</span>
                                </Grid>
                                <Grid xs={12}>
                                    <Slider
                                        defaultValue={10}
                                        aria-label="Velocidad"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={100}
                                        onChange={handleSpeedChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Grid xs={12}>
                                    <span>Controles</span>
                                </Grid>
                                <Grid xs={6} xsOffset={3} md={4} mdOffset={4}>
                                    <Button variant="outlined" onClick={() => sendCommand('F')}>
                                        <KeyboardArrowUpIcon />
                                    </Button>
                                </Grid>
                                <Grid xs={4} md={4} mdOffset={2}>
                                    <Button variant="outlined" onClick={() => sendCommand('L')}>
                                        <KeyboardArrowLeftIcon />
                                    </Button>
                                </Grid>
                                <Grid xs={4} xsOffset={4} md={4} mdOffset={0}>
                                    <Button variant="outlined" onClick={() => sendCommand('R')}>
                                        <KeyboardArrowRightIcon />
                                    </Button>
                                </Grid>
                                <Grid xs md={4} mdOffset={4}>
                                    <Button variant="outlined" onClick={() => sendCommand('B')}>
                                        <KeyboardArrowDownIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Grid xs={12}>
                                    <span>Estados</span>
                                </Grid>
                                <Grid xs={6} md={6}>
                                    <Button variant="outlined" onClick={() => sendCommand('S')}>
                                        <PauseIcon /> Pausar
                                    </Button>
                                </Grid>
                                <Grid xs={6} md={6}>
                                    <Button variant="contained" color="secondary" onClick={stopExperiment}>
                                        <StopIcon /> Detener
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                        <Grid container spacing={1} sx={{ textAlign: 'start' }}>
                                <Grid xs={12}>
                                    <span>Estado de Bumpers</span>
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={0} active={bumpers[0]} />
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={1} active={bumpers[1]} />
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={2} active={bumpers[2]} />
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={3} active={bumpers[3]} />
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={4} active={bumpers[4]} />
                                </Grid>
                                <Grid xs={2}>
                                    <BumperIndicator bumper={5} active={bumpers[5]} />
                                </Grid>
                            </Grid>
                </Grid>
            </ExperimentPageStructure>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Footer />
            </Box>
        </>
    );
}

export default ExperimentManualControlPage;
