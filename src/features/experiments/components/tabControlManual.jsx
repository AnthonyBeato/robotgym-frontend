import Stack from '@mui/material/Stack';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import ROSLIB from 'roslib';
import PropTypes from 'prop-types';

export default function TabControlManual({availableRobots}) {

    const [robotSelected, setRobotSelected] = useState('');
    const [speed, setSpeed] = useState(0.5);  // Velocidad linear en 0.5
    const [angularSpeed, setAngularSpeed] = useState(1.0); // Velocidad angular inicial
    const [rosInstance, setRosInstance] = useState(null);
    const [publisher, setPublisher] = useState(null);


    const handleChange = (event) => {
        const selectedRobotId = event.target.value;
        setRobotSelected(selectedRobotId);

        const selectedRobot = availableRobots.find(robot => robot._id === selectedRobotId);

        if (selectedRobot) {
            const rosConnection = new ROSLIB.Ros({
                url: `ws://${selectedRobot.ip}:9090`,
            });

            rosConnection.on('connection', () => {
                console.log(`Connected to ROS at ${selectedRobot.ip}`);
                setRosInstance(rosConnection);
                console.log('rosConnection ', rosConnection);

                const robotNumber = getRobotNumber(selectedRobot.hostname);
                if (robotNumber) {
                    const topicName = `/robot_${robotNumber}/diffbot_base_controller/cmd_vel_unstamped`;
                    const newPublisher = new ROSLIB.Topic({
                        ros: rosConnection,
                        name: topicName,
                        messageType: 'geometry_msgs/Twist',
                    });
                    setPublisher(newPublisher);
                }
            });

            rosConnection.on('error', (error) => {
                console.log(`Error connecting to ROS at ${selectedRobot.ip}:`, error);
            });

            rosConnection.on('close', () => {
                console.log(`Connection to ROS at ${selectedRobot.ip} closed.`);
                setRosInstance(null);
                setPublisher(null);
            });
        }
    };


    const handleSpeedChange = (event, newValue) => {
        setSpeed(newValue / 10);  // Adjust according to your scale (0 to 10000)
    };

    const handleAngularSpeedChange = (event, newValue) => {
        setAngularSpeed(newValue);  // Ajusta la escala de 0 a 10
    };

    const getRobotNumber = (hostname) => {
        const match = hostname.match(/\d+/);
        return match ? match[0] : null;
    };


    const sendCommand = (linearX, angularZ) => {
        if (rosInstance && publisher) {
            const message = new ROSLIB.Message({
                linear: {
                    x: linearX * speed,
                    y: 0.0,
                    z: 0.0
                },
                angular: {
                    x: 0.0,
                    y: 0.0,
                    z: angularZ * angularSpeed
                }
            });

            console.log(`Sending command - linearX: ${linearX}, angularZ: ${angularZ}`);
            publisher.publish(message);
        } else {
            console.log('Not connected to websocket server or robot not selected.');
        }
    };

  return (
    <div>
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
                value={robotSelected}
                label="RobotNumber"
                onChange={handleChange}
            >
                {availableRobots.length > 0 ? (
                    availableRobots.map(robot => (
                        <MenuItem key={robot._id || robot.model} value={robot._id || ''}>
                            {robot.model || 'Unknown Robot'}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem value="">No Robots Available</MenuItem>
                )}
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

            <Grid xs={12}>
            <span>Velocidad Angular</span>
          </Grid>
          <Grid xs={12}>
            <Slider
              defaultValue={1}
              aria-label="Velocidad Angular"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0}
              max={10}
              onChange={handleAngularSpeedChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Grid xs={12}>
                <span>Controles</span>
            </Grid>
            <Grid xs={12}>
                <Grid container spacing={1} justifyContent={"center"}>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(0.5, 0.5)}>
                            <NorthWestIcon />
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(1.0, 0.0)}>
                            <NorthIcon />
                        </Button> 
                    </Grid>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(0.5, -0.5)}>
                            <NorthEastIcon />
                        </Button>                  
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12} >
                <Grid container spacing={1} justifyContent={"center"}>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(0.0, 1.0)}>
                            <WestIcon />
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={() => sendCommand(0.0, 0.0)}>
                            <PauseIcon />
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(0.0, -1.0)}>
                            <EastIcon />
                        </Button>
                    </Grid>                      
                </Grid>
            </Grid>
            <Grid  xs={12}>
                <Grid container spacing={1} justifyContent={"center"}>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(-0.5, 0.5)}>
                            <SouthWestIcon />
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" onClick={() => sendCommand(-1.0, 0.0)}>
                            <SouthIcon />
                        </Button>
                    </Grid>
                    <Grid>            
                        <Button variant="outlined" onClick={() => sendCommand(-0.5, -0.5)}>
                            <SouthEastIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        {/* <Grid container spacing={1} sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Grid xs={12}>
                <span>Estado</span>
            </Grid>
            <Grid xs={12} md={12}>
                <Button variant="outlined" onClick={() => sendCommand('S')}>
                    <PauseIcon /> Pausar
                </Button>
            </Grid>
        </Grid> */}
    </Stack>
    </div>
  );
}

TabControlManual.propTypes = {
    availableRobots: PropTypes.array.isRequired
};
