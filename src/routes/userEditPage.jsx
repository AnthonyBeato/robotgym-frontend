import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import GeneralPageStructure from '../components/GeneralPageStructure';
import Stack from '@mui/material/Stack';

import EditUser from '../features/users/components/edit-user';
import { useContext } from "react"; 
import { AuthContext } from '../context/AuthContext';
import { Navigate } from "react-router-dom"; 

function EditUserPage() {
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

                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <h1>Edita el Usuario</h1>
                        <EditUser />
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

export default EditUserPage;