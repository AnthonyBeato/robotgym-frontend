import React from 'react';

import Box from '@mui/material/Box';

export default function BoxPersonalized({ children }) {
    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            gap={4}
            my={4}
            p={2}
            sx={{
                borderRadius: 1,
                border: '1px solid grey'
            }}

        >

            {children}
        </Box>
    );
}