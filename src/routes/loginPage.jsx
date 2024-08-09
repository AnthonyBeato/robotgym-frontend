import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import GeneralPageStructure from '../components/GeneralPageStructure';
import Stack from '@mui/material/Stack';

import Login from '../features/users/components/login';


function LoginPage() {
    return (
        <>
            <GeneralPageStructure>
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >

                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <h1>Inicia Sesión</h1>
                    </Box>

                    <Login />


                </Stack>
            </GeneralPageStructure>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Footer />
            </Box>

        </>
    )
}

export default LoginPage;