import DragNdrop from "./DragDrop";
import { useState } from "react";
import Button from '@mui/material/Button';
import CircularProgress  from "@mui/material/CircularProgress";
import { PlayArrow } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';
import axiosInstance from "../../../instance/axiosIntance";
import PropTypes from 'prop-types'; // ES6
import {  useContext} from 'react';
import { AuthContext } from "../../../context/AuthContext";

export default function TabControlRoutine({experimentId}) {

  const [file, setFile] = useState(null);
  const { token } = useContext(AuthContext);
  const [isRunning, setIsRunning] = useState(false); 

  const handleExecute = async () => {
    if (file) {
      const formData = new FormData();
      // Adjuntando el archivo
      formData.append('file', file);
      formData.append('experimentId', experimentId); 

      try {
        const apiUrl = import.meta.env.VITE_HOST;
        
        // Subir el archivo al backend
        const uploadResponse = await axiosInstance.post(`${apiUrl}/routines/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`  
          },
        });
        
        if (uploadResponse.status === 201) {
          console.log('Routine uploaded successfully');
          
          // Luego de la subida exitosa, ejecutar la rutina
          const routineId = uploadResponse.data.routine._id;  
          
          
          setIsRunning(true);
          const runResponse = await axiosInstance.post(`${apiUrl}/routines/run/${routineId}`, {}, {
            headers: {
              'Authorization': `Bearer ${token}` 
            },
          });
          
          if (runResponse.status === 200) {
            console.log('Routine executed successfully');
          } else {
            console.error('Failed to execute routine');
          }
        } else {
          console.error('Failed to upload routine');
        }
      } catch (error) {
        console.error('Error uploading or executing the routine:', error);
      }
    } else {
      console.log('No files selected');
    }
  };

  const handleStop = async () => {
    try {
      const apiUrl = import.meta.env.VITE_HOST;
      await axiosInstance.post(`${apiUrl}/routines/stop-routine`, { experimentId }, {
        headers: {
          'Authorization': `Bearer ${token}` 
        },
      });
      setIsRunning(false); 
      console.log('Routine stopped successfully');
    } catch (error) {
      console.error('Error stopping the routine:', error);
    }
  };

  return (
    <div>
      <Grid container gap={2} sx={{flexGrow: 1, justifyContent: 'center'}}>
        <Grid>
          <DragNdrop onFileSelected={setFile} width="300px" height='300px' />
        </Grid>
        <Grid >
        {isRunning ? (
            <div>
              <Button variant="contained" color="primary" disabled>
                Ejecutando rutina...
              </Button>
              <CircularProgress />
              <Button variant="contained" color="secondary" onClick={handleStop}>
                Detener ejecución
              </Button>
            </div>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleExecute}>
              <PlayArrow /> Ejecutar
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

TabControlRoutine.propTypes = {
  experimentId: PropTypes.string.isRequired,
}
