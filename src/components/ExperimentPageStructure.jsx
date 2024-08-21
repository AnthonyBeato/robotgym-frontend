import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types'; // ES6


export default function ExperimentPageStructure({ children }) {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(235, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(235, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14/2, sm: 25/2 },
          pb: { xs: 8/2, sm: 12/2 },
        }}
      >

        {children}

      </Container>
    </Box>
  );
}

ExperimentPageStructure.propTypes = {
    children: PropTypes.node.isRequired,
}

