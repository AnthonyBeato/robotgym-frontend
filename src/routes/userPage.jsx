import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import GeneralPageStructure from '../components/GeneralPageStructure';
import Stack from '@mui/material/Stack';
import UserList from '../features/users/components/user-list';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";


function UserPage() {
    return (
        <>
            <GeneralPageStructure>
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >
                    <h1>Usuarios</h1>


                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/users/create-user"
                        >
                            Crear
                        </Button>
                        <UserList />
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

export default UserPage;