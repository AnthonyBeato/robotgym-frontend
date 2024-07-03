import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hero from '../features/home/components/Hero';
import LogoCollection from '../features/home/components/LogoCollection';
import Highlights from '../features/home/components/Highlights';
import Pricing from '../features/home/components/Pricing';
import Features from '../features/home/components/Features';
import Testimonials from '../features/home/components/Testimonials';
import FAQ from '../features/home/components/FAQ';
import Footer from '../components/Footer';


function HomePage() {
    return (
        <>
            <Hero />
            <Box sx={{ bgcolor: 'background.default' }}>
                <LogoCollection />
                <Features />
                <Divider />
                <Testimonials />
                <Divider />
                <Highlights />
                <Divider />
                <Pricing />
                <Divider />
                <FAQ />
                <Divider />
                <Footer />
            </Box>
        </>
    )
}

export default HomePage
