import DragNdrop from "./DragDrop";
import { useState } from "react";
import Button from '@mui/material/Button';
import { PlayArrow } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import PropTypes from 'prop-types'; // ES6
import {  useContext} from 'react';
import { AuthContext } from "../../../context/AuthContext";

export default function TabControlRoutine({experimentId}) {

  const [file, setFile] = useState(null);
  const { token } = useContext(AuthContext);

  const handleExecute = async () => {
    if (file) {
      const formData = new FormData();
      // Adjuntando el archivo
      formData.append('file', file);
      formData.append('experimentId', experimentId); 

      try {
        const apiUrl = import.meta.env.VITE_HOST;
        
        // Subir el archivo al backend
        const uploadResponse = await axios.post(`${apiUrl}/routines/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`  
          },
        });
        
        if (uploadResponse.status === 201) {
          console.log('Routine uploaded successfully');
          
          // Luego de la subida exitosa, ejecutar la rutina
          const routineId = uploadResponse.data.routine._id;  
          
          const runResponse = await axios.post(`${apiUrl}/routines/run/${routineId}`, {}, {
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

  return (
    <div>
      <Grid container gap={2} sx={{flexGrow: 1, justifyContent: 'center'}}>
        <Grid>
          <DragNdrop onFileSelected={setFile} width="300px" height='300px' />
        </Grid>
        <Grid >
          <Button variant="contained" color="secondary" onClick={handleExecute}>
            <PlayArrow/> Ejecutar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

TabControlRoutine.propTypes = {
  experimentId: PropTypes.string.isRequired,
}
