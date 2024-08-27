import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../instance/axiosIntance';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import ExperimentPageStructure from '../components/ExperimentPageStructure';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
// import { CameraAlt, FiberManualRecord } from '@mui/icons-material';
import PropTypes from 'prop-types'; // ES6
import ControlTabs from '../features/experiments/components/ControlTabs';
import StopIcon from '@mui/icons-material/Stop';
import CustomAlert from '../components/CustomAlert';
import CountdownTimer from '../features/experiments/components/CountdownTimer';

const BumperIndicator = ({ active }) => {
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

BumperIndicator.propTypes = {
    active: PropTypes.bool.isRequired,
}

function ExperimentControlPage() {
    const { token, loading } = useContext(AuthContext);

    const { id: experimentId } = useParams();

    // const [bumpers, setBumpers] = useState([false, false, false, false, false, false]);  // Initial bumper states
    // const rosRef = useRef(null);  // Use useRef to keep track of the ros instance
    // const bumperListenerRef = useRef(null);  // Use useRef to keep track of the bumper listener
    const [experimentTitle, setExperimentTitle] = useState('');
    const [availableRobots, setAvailableRobots] = useState([]);
    const [connected] = useState(false);
    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [endTime, setEndTime] = useState('');
    const [experimentActivated, setExperimentActivated] = useState(true);

    // const maxReconnectAttempts = 10;

    // const connectWebSocket = useCallback(() => {
    //     if (reconnectAttemptsRef.current > maxReconnectAttempts) {
    //         console.error('Failed to connect to websocket server after maximum attempts');
    //         setIsReconnecting(false);
    //         return;
    //     }

    //     if (rosRef.current) {
    //         rosRef.current.close();
    //     }

    //     const ros = new ROSLIB.Ros({
    //         url: 'ws://192.168.1.118:9090',
    //     });

    //     ros.on('connection', () => {
    //         console.log('Connected to websocket server.');
    //         setConnected(true);
    //         setIsReconnecting(false);
    //         reconnectAttemptsRef.current = 0;  // Reset reconnect attempts on successful connection
        
    //         // // Suscribir al tópico de estado de bumpers
    //         // if (bumperListenerRef.current) {
    //         //     bumperListenerRef.current.unsubscribe();
    //         // }
        
    //         // const bumperListener = new ROSLIB.Topic({
    //         //     ros: ros,
    //         //     name: '/bumpers_status',
    //         //     messageType: 'std_msgs/String',
    //         // });
        
    //         // bumperListener.subscribe((message) => {
    //         //     console.log('Received bumper status: ', message.data);
    //         //     const bumperData = parseInt(message.data.split(':')[1], 16);
    //         //     const bumperStates = [
    //         //         (bumperData & 0x01) !== 0,
    //         //         (bumperData & 0x02) !== 0,
    //         //         (bumperData & 0x04) !== 0,
    //         //         (bumperData & 0x08) !== 0,
    //         //         (bumperData & 0x10) !== 0,
    //         //         (bumperData & 0x20) !== 0,
    //         //     ];
    //         //     setBumpers(bumperStates);
    //         // });
        
    //         // bumperListenerRef.current = bumperListener;  // Guarda la referencia del listener de bumpers
    //     });
        
    //     ros.on('error', (error) => {
    //         console.log('Error connecting to websocket server: ', error);
    //         setConnected(false);
    //         if (!isReconnecting) {
    //             reconnectAttemptsRef.current++;
    //             setIsReconnecting(true);
    //             reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);  
    //         }
    //     });
        
    //     ros.on('close', () => {
    //         console.log('Connection to websocket server closed.');
    //         setConnected(false);
    //         if (!isReconnecting) {
    //             reconnectAttemptsRef.current++;
    //             setIsReconnecting(true);
    //             reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000); 
    //         }
    //     });
    //     rosRef.current = ros;  //  ros reference guardada 
    // }, [isReconnecting, setConnected]);

    // useEffect(() => {
    //     connectWebSocket();

    //     return () => {
    //         if (rosRef.current) {
    //             rosRef.current.close();
    //         }
    //         // if (bumperListenerRef.current) {
    //         //     bumperListenerRef.current.unsubscribe();
    //         // }
    //         if (reconnectTimeoutRef.current) {
    //             clearTimeout(reconnectTimeoutRef.current);
    //         }
    //     };
    // }, [connectWebSocket]);

    const stopExperiment = () => {
        const apiUrl = import.meta.env.VITE_HOST;
        axiosInstance.post(`${apiUrl}/experiments/stop-experiment/${experimentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.status === 200) {
                setAlertMessage('Experimento detenido exitosamente');
                setAlertSeverity('success');
                setAlertOpen(true);
                setTimeout(() => {
                    navigate("/experiments");
                }, 1500);
            } else {
                Promise.reject();
            }
        })
        .catch((error) => {
            setAlertMessage("Algo ha salido mal detener el experimento: " + error.message);
            setAlertSeverity('error');
            setAlertOpen(true);
        });
      };


    useEffect(() => {
        const apiUrl = import.meta.env.VITE_HOST;
        axiosInstance.get(
            apiUrl + '/experiments/' + experimentId, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        )
            .then((res) => {
                const {
                    name,
                    startTime,
                    isActive,
                } = res.data;
                setExperimentTitle(name);
                setEndTime(new Date(startTime).getTime() + 2 * 60 * 60 * 1000);
                setExperimentActivated(isActive)
            })
            .catch(err => console.log(err)
            );
    }, [token, experimentId]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_HOST;
        axiosInstance.get(
            `${apiUrl}/experiments/${experimentId}/robots`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                setAvailableRobots(res.data);
            })
            .catch(err => console.log(err)
            );
    }, [token, experimentId]);
    
    

    // const takePhoto = () => {
    //     const cameraUrl = import.meta.env.VITE_CAMERA_HOST; 
    //     window.location.href = `${cameraUrl}/capture_photo`; 
    // };

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/users/login" replace />;
    }

    if (!experimentActivated) {
        return <Navigate to="/experiments" replace />;
    }

    return (
        <>
            <ExperimentPageStructure>
                <Grid container spacing={2}>
                    <Grid container xs={12} md={12} sx={{alignItems: 'center', justifyContent: 'space-between'}} >
                        <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <h1>{experimentTitle}</h1>
                        </Grid>
                        <Grid sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                            <Grid sx={{ textAlign: 'right' }}>
                                <span>Tiempo disponible:</span>
                                <CountdownTimer endTime={endTime} />
                            </Grid>
                            <Grid xs={6} >
                                <Button variant="outlined" color="primary" onClick={stopExperiment}>
                                    <StopIcon /> Detener experimento
                                </Button>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid md={8} sx={{border: 0}}>
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
                            {/* <Grid>
                                <Button variant="outlined" color='primary' onClick={takePhoto}>
                                    <CameraAlt style={{paddingRight: 2}}/> Tomar Foto
                                </Button>
                            </Grid>
                            <Grid>    
                                <Button variant="outlined" color='primary' >
                                   <FiberManualRecord style={{paddingRight: 2}}/> Grabar
                                </Button>
                            </Grid> */}
                        </Grid>
                    </Grid>
                    <Grid md={4} sx={{border: 0}}>
                        <ControlTabs connected={connected} experimentId={experimentId} availableRobots={availableRobots} />
                    </Grid>
                    {/* <Grid container spacing={1} sx={{ textAlign: 'start' }}>
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
                    </Grid> */}
                </Grid>
            </ExperimentPageStructure>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Footer />
            </Box>

            <CustomAlert 
                open={alertOpen} 
                onClose={() => setAlertOpen(false)} 
                message={alertMessage} 
                severity={alertSeverity} 
            />
        </>
    );
}

export default ExperimentControlPage;
