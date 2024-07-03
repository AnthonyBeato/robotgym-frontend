import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import GeneralPageStructure from '../components/GeneralPageStructure';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import FormControl from '@mui/material/FormControl';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

function Experiment() {
    const [cantRobot, setCantRobots] = React.useState('');

    const handleChange = (event) => {
        setCantRobots(event.target.value);
    };

    return (
        <>
            <GeneralPageStructure>
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >

                    <h1>Inicia tu experimento</h1>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Grid container spacing={2} >
                            <Grid xs={12}>
                                <FormControl fullWidth sx={{ m: 1 }} >

                                    <TextField
                                        id="experiment-name"
                                        // hiddenLabel
                                        placeholder='Nombre'
                                        aria-label='Nombre del experimento'
                                        fullWidth
                                        size='small'
                                        required
                                        variant="filled"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <FormControl fullWidth sx={{ m: 1 }} >

                                    <TextField
                                        id="txt-experiment-description"
                                        // hiddenLabel
                                        placeholder='Descripción'
                                        // aria-label='Descripción del experimento'
                                        fullWidth
                                        multiline
                                        rows={6}
                                        size='small'
                                        variant="filled"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={6}>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="select-cant-robots-label">Cant. Robots</InputLabel>
                                    <Select
                                        labelId="select-cant-robots-label"
                                        id="select-cant-robots"
                                        value={cantRobot}
                                        variant='filled'
                                        label="Cant. Robots"
                                        required
                                        hiddenLabel
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                    </Select>
                                    <FormHelperText>Robots para experimento</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>

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

export default Experiment;