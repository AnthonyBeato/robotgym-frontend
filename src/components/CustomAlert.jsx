import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import PropTypes from 'prop-types';

const CustomAlert = ({ open, onClose, message, severity = 'success', duration = 6000 }) => {
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={duration} 
            onClose={onClose}
        >
            <Alert 
                onClose={onClose} 
                severity={severity} 
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};


CustomAlert.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    duration: PropTypes.number,
};

export default CustomAlert;
