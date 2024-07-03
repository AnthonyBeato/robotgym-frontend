import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hero from '../components/Hero';
import LogoCollection from '../components/LogoCollection';
import Highlights from '../components/Highlights';
import Pricing from '../components/Pricing';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

function Experiment() {
    return (
        <>
            <Hero />
            <Box sx={{ bgcolor: 'background.default' }}>
                <Divider />
                <Divider />
                <Divider />
                <FAQ />
                <Divider />
                <Footer />
            </Box>

        </>
    )
}

export default Experiment;