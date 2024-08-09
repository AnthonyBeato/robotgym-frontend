import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import GeneralPageStructure from '../components/GeneralPageStructure';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

import { useContext } from "react"; 
import { AuthContext } from '../context/AuthContext';
import { Navigate } from "react-router-dom"; 
import RobotList from '../features/robots/components/robot-list';

function RobotPage() {
    const { token, loading } = useContext(AuthContext);
    if (loading) {
      return null;
    }
  
    if (!token) {
      return <Navigate to="/users/login" replace />;
    }

    return (
        <>
            <GeneralPageStructure>
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >
                    <h1>Robots</h1>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>

                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/robots/create-robot"
                        >
                            Crear
                        </Button>

                        <div style={{ height: 400, width: "100%" }}>
                            <RobotList />
                        </div>
                        
                    </Box>

                </Stack>
            </GeneralPageStructure>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Footer />
            </Box>

        </>
    )
}

export default RobotPage;